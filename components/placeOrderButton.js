import * as React from "react";

import {
  Button,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";

import { CartBadge } from "./cart";

export const PlaceOrderButton = ({
  onPlaceOrder,
  isOrderedPlaced,
  onCancelOrder,
  orderItems = [],
}) => {
  return (
    <ButtonGroup variant="contained">
      {isOrderedPlaced ? (
        <CircularProgress />
      ) : (
        <CartBadge cartItems={orderItems} />
      )}
      <Button
        color="secondary"
        variant="string"
        size={isOrderedPlaced ? "small" : "medium"}
        onClick={isOrderedPlaced ? onCancelOrder : onPlaceOrder}
        disabled={orderItems.length == 0}
      >
        {isOrderedPlaced ? "Cancel Order" : "PlaceOrder"}
      </Button>
    </ButtonGroup>
  );
};
