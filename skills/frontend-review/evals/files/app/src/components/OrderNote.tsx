// Renders the customer's free-text note, which may contain HTML they typed.
export function OrderNote({ note }: { note: string }) {
  return <div className="note" dangerouslySetInnerHTML={{ __html: note }} />;
}
