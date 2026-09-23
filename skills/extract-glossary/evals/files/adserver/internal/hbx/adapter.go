package hbx

// Adapter converts prebid.js header bidding requests into internal bid requests.
type Adapter struct{ timeoutMs int }

func (a Adapter) Convert(raw []byte) (BidRequest, error) { return parse(raw) }
