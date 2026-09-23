package bidder

// HandleBid handles an OpenRTB 2.6 bid request from an SSP.
// Bids below the placement floor price are dropped.
func HandleBid(req BidRequest) (*BidResponse, error) {
	pl := loadPlacement(req.Imp[0].TagID) // adv_placements via Redis
	if bidCPM(req) < pl.FloorCPM {
		return nil, ErrBelowFloor
	}
	return buildResponse(req, pl), nil
}
