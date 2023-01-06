import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const Product = ({
  title,
  price,
  description,
  onAddRemove,
  notInCart,
}) => {
  return (
    <Card sx={{ width: 300 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/paella.jpeg"
        title="A paella"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onAddRemove}>
          {notInCart ? "Add to Cart" : "Remove From Cart"}
        </Button>
      </CardActions>
    </Card>
  );
};
