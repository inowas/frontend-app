import {createControlComponent} from "@react-leaflet/core";
import {Map, Control, DomUtil} from "leaflet";

const Watermark = Control.extend({
  onAdd: function (map: Map) {
    const img = DomUtil.create("img");
    img.src = "./logo.png";
    img.style.width = "200px";
    return img;
  },

  onRemove: function (map: Map) {
  },
});

export const WatermarkControl = createControlComponent(
  (props) => new Watermark(props)
);
