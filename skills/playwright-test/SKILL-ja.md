---
name: playwright-test
description: Playwright Test (E2E) のベストプラクティスとリファレンス。テストの書き方、固定 wait 回避、ネットワークトリガー、DnD、GitHub Actions での shard/retry 設定など。Playwright テストを書く・レビュー・CI 設定するときに使用。
license: MIT
---

# Playwright Test

## 設定テンプレート

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,       // CI で .only を禁止
  retries: process.env.CI ? 2 : 0,    // CI のみリトライ
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html'], ['github']]           // CI: HTML + GitHub annotations
    : [['html']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',          // リトライ時のみトレース記録
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

## GitHub Actions

CI 設定は [references/github-actions.md](references/github-actions.md) を参照: 必須の Linux CJK フォント、shard なしの基本ワークフロー、shard 実行と shard × browser matrix + レポート統合、retry 戦略、trace/screenshot/video の選択基準、browser 別の条件付きテスト、JSON reporter を使った flaky 検出運用。

## 鉄則: 固定 wait を使わない

Playwright は要素がアクション可能になるまで自動で待機する。`waitForTimeout()` は禁止。

```ts
// BAD
await page.waitForTimeout(3000);
await page.click('#submit');

// GOOD: 自動待機
await page.getByRole('button', { name: 'Submit' }).click();

// GOOD: web-first assertion (自動リトライ)
await expect(page.getByText('Success')).toBeVisible();

// BAD: リトライなし
expect(await page.getByText('Success').isVisible()).toBe(true);
```

**One-shot 読み取り API は auto-retry しない**:

| 形式 | 挙動 |
|---|---|
| `expect(locator).toBeVisible()` / `toHaveText(...)` 等 | **auto-retry あり**（既定 5s）。これを使う |
| `await locator.isVisible()` / `innerText()` / `count()` / `textContent()` | **1 発読み取り、retry なし**。flaky の温床 |

flaky なら高確率で one-shot API を web-first assertion に置換できる:

```ts
// BAD
const n = await page.locator('.row').count();
expect(n).toBeGreaterThan(0);

// GOOD
await expect(page.locator('.row')).not.toHaveCount(0);
```

明示的な待機が必要なケース:

```ts
await page.waitForURL('**/dashboard');          // ナビゲーション後
await expect(page.getByRole('main')).toBeVisible(); // 重い初期ロード: 必要な要素の表示を待つ（'networkidle' は非推奨）
await page.waitForResponse('**/api/data');       // API レスポンス待ち
```

## ネットワークトリガー

**アクションの前に** Promise をセットアップする:

```ts
const responsePromise = page.waitForResponse('**/api/users');
await page.getByRole('button', { name: 'Save' }).click();
const response = await responsePromise;
expect(response.status()).toBe(200);

// 条件付きマッチ
const responsePromise = page.waitForResponse(
  resp => resp.url().includes('/api/users') && resp.request().method() === 'POST'
);
```

**`waitForResponse` が永久待機する罠**: 対象 API がそもそも呼ばれない（SPA で全データを初期 bundle に持つ、cache hit で skip する 等）ケースでは timeout まで止まる。**fallback 順位**:

1. まず `waitForResponse` が必須かを判定（API 呼出しが副作用の確定タイミングなら必要）
2. API が呼ばれないなら **web-first assertion 単独** で十分（`await expect(page.getByTestId('result')).toBeVisible()`）
3. timeout を短く制限したい場合は `{ timeout: 5_000 }` を渡す
4. 任意レスポンスをカウントしたい場合は `page.on('response', ...)` で listener 化（waitFor ではなく event 集計）

### API モック

`page.route()` は `page.goto()` の**前に**登録する:

```ts
await page.route('**/api/items', route => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ items: [{ id: 1, name: 'Test' }] }),
}));

// レスポンスを改変
await page.route('**/api/data', async route => {
  const response = await route.fetch();
  const json = await response.json();
  json.debug = true;
  await route.fulfill({ response, json });
});

// リソースブロック（高速化）
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
```

### HAR によるネットワーク記録・再生

実際の API レスポンスを記録して、テスト時にそのまま再生できる:

```ts
// 記録: テスト実行時に HAR ファイルを生成
test('record HAR', async ({ page }) => {
  await page.routeFromHAR('tests/fixtures/api.har', {
    url: '**/api/**',
    update: true,  // true で記録モード、false で再生モード
  });
  await page.goto('/');
  // ...操作すると API レスポンスが HAR に保存される
});

// 再生: 記録済み HAR からレスポンスを返す（ネットワーク不要）
test('replay from HAR', async ({ page }) => {
  await page.routeFromHAR('tests/fixtures/api.har', {
    url: '**/api/**',
    update: false,  // 再生モード
  });
  await page.goto('/');
  await expect(page.getByText('data from API')).toBeVisible();
});
```

CLI で HAR を記録する方法:

```bash
npx playwright open --save-har=tests/fixtures/api.har https://example.com
```

### リクエスト・レスポンスの検証

```ts
// リクエストボディを検証
const requestPromise = page.waitForRequest('**/api/submit');
await page.getByRole('button', { name: 'Submit' }).click();
const request = await requestPromise;
expect(request.method()).toBe('POST');
expect(JSON.parse(request.postData()!)).toEqual({ name: 'test' });

// レスポンスボディを検証
const responsePromise = page.waitForResponse('**/api/submit');
await page.getByRole('button', { name: 'Submit' }).click();
const response = await responsePromise;
const body = await response.json();
expect(body.id).toBeDefined();
```

### Context レベルのルーティング

全ページに共通のモックを適用する場合は `context.route()` を使う:

```ts
test('context-level mock', async ({ context, page }) => {
  // context 内の全ページに適用
  await context.route('**/api/config', route => route.fulfill({
    status: 200,
    json: { featureFlag: true },
  }));
  await page.goto('/');
  const popup = await page.waitForEvent('popup');  // 新しいタブにも適用される
  await expect(popup.getByText('Feature enabled')).toBeVisible();
});
```

## Drag and Drop

### シンプルなケース

```ts
await page.locator('#source').dragTo(page.locator('#target'));
```

### DnD ライブラリ (react-dnd, dnd-kit, SortableJS)

ポインターイベントベースのライブラリは `dragTo` が動かないことが多い:

```ts
async function dragAndDrop(page: Page, source: Locator, target: Locator) {
  const srcBox = (await source.boundingBox())!;
  const tgtBox = (await target.boundingBox())!;

  await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(tgtBox.x + tgtBox.width / 2, tgtBox.y + tgtBox.height / 2, { steps: 10 });
  await page.mouse.up();
}
```

- `{ steps: 10 }` で中間の `pointermove`/`dragover` イベントを生成
- `DataTransfer` を使うライブラリは `page.evaluate()` で合成イベントが必要な場合あり
- アニメーションではなく最終状態（要素の順序・位置）をアサートする

## ロケーター

優先順位（上ほど推奨）:

```ts
page.getByRole('button', { name: 'Submit' });  // 1. ロールベース
page.getByLabel('Email');                        // 2. ラベル
page.getByText('Welcome');                       // 2. テキスト
page.getByTestId('nav-menu');                    // 3. テスト ID
page.locator('button.btn-primary');              // 4. CSS (避ける)
```

チェーンとフィルター:

```ts
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });
await product.getByRole('button', { name: 'Add to cart' }).click();
```

### モーダル / Dialog の扱い

モーダルは `getByRole('dialog')` でスコープして内部要素を引く。閉じ確認は `toBeHidden()`:

```ts
// 開く
await page.getByRole('button', { name: 'New Project' }).click();
const dialog = page.getByRole('dialog');
await expect(dialog).toBeVisible();

// 内部操作はスコープ内で
await dialog.getByLabel('Name').fill('My Project');
await dialog.getByRole('button', { name: 'Save' }).click();

// 閉じ確認（fade out アニメーション中は toBeHidden が auto-retry で待つ）
await expect(dialog).toBeHidden();

// 反映結果を外側で確認
await expect(
  page.getByRole('list', { name: 'projects' }).getByRole('listitem').filter({ hasText: 'My Project' })
).toBeVisible();
```

`role="alertdialog"` は警告系ダイアログ（削除確認など）で `getByRole('alertdialog')` を使う。

## アサーション

web-first assertion は自動リトライする:

```ts
await expect(page.getByText('Success')).toBeVisible();
await expect(page.getByRole('listitem')).toHaveCount(3);
await expect(page.getByTestId('status')).toHaveText('Done');
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle(/Home/);

// ソフトアサーション（失敗してもテスト続行）
await expect.soft(page.getByTestId('count')).toHaveText('5');
```

## 認証の再利用

```ts
// tests/auth.setup.ts
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@test.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

認証不要なテスト: `test.use({ storageState: { cookies: [], origins: [] } })`

## ファイル操作

```ts
// アップロード
await page.getByLabel('Upload').setInputFiles('myfile.pdf');

// バッファから（ファイル不要）
await page.getByLabel('Upload').setInputFiles({
  name: 'file.txt', mimeType: 'text/plain', buffer: Buffer.from('content'),
});

// ダウンロード
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download').click();
const download = await downloadPromise;
await download.saveAs('/tmp/file.pdf');
```

## Page Object Model

シンプルに保つ。アサーションはテストファイル側:

```ts
class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    // フィールド初期化子ではなくここで代入する。useDefineForClassFields（target ES2022 以上の既定）では、初期化子が `page` の設定より先に走る。
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, pass: string) {
    await this.email.fill(email);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
```

## デバッグ

```bash
npx playwright test --debug          # Inspector 起動
npx playwright test --ui             # UI モード (time-travel)
npx playwright test --trace on       # トレース生成
npx playwright show-report           # レポート表示
```

コード内: `await page.pause()` でテスト途中に Inspector を開く。
