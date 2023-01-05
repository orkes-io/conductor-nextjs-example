import * as React from "react";

import {
  Grid,
  Stack,
  Button,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import { CartBadge } from "./cart";
// import SaveIcon from '@mui/icons-material/Save';
// import Stack from '@mui/material/Stack';

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
