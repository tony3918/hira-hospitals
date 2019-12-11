import React, { useState } from "react";
import DeckGL, { ScatterplotLayer, RGBAColor, HexagonLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { data } from "./data";

export type Hospital = {
  name: string;
  type: string;
  date: number;
  numDoctor: number;
  long: number;
  lat: number;
};

const INITIAL_VIEW_STATE = {
  longitude: 127.9259,
  latitude: 36.991,
  zoom: 7,
  minZoom: 7,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const SCATTERPLOT_CONTROLS = {
  showScatterplot: {
    displayName: "Show Scatterplot",
    type: "boolean",
    value: true
  },
  radiusScale: {
    displayName: "Scatterplot Radius",
    type: "range",
    value: 30,
    step: 10,
    min: 10,
    max: 200
  }
};

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const COLOR: RGBAColor = [114, 19, 108];

const App: React.FC = () => {
  const [hover, setHover] = useState({ x: 0, y: 0, label: "" });

  return (
    <div>
      {hover.label && (
        <div
          style={{
            position: "absolute",
            padding: "4px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            maxWidth: "300px",
            fontSize: "10px",
            zIndex: 9,
            pointerEvents: "none",
            transform: `translate(${hover.x}px, ${hover.y}px)`
          }}
        >
          <div>{hover.label}</div>
        </div>
      )}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        width="100%"
        height="100%"
        layers={[
          new ScatterplotLayer({
            id: "scatterplot",
            getPosition: (d: Hospital) => [d.long, d.lat],
            getColor: COLOR,
            getRadius: 10,
            onHover: ({ x, y, object }) => {
              if (!object) return;
              const label = `${(object as Hospital).name}, 의사 ${
                (object as Hospital).numDoctor
              }명`;
              setHover({
                x,
                y,
                label
              });
            },
            pickable: true,
            radiusMinPixels: 0.25,
            radiusMaxPixels: 30,
            data,
            radiusScale: 30
          }),
          new HexagonLayer({
            id: "hexagon",
            data,
            pickable: true,
            extruded: true,
            radius: 200,
            // elevationScale: 4,
            getPosition: (d: Hospital) => [d.long, d.lat],
            lightSettings: LIGHT_SETTINGS
          })
        ]}
      >
        <StaticMap
          mapStyle={"mapbox://styles/mapbox/light-v9"}
          width="100%"
          height="100%"
          mapboxApiAccessToken="pk.eyJ1IjoidG9ueTM5MTgiLCJhIjoiY2s0MTkxNHhkMDljNDNtbjk2cjlxZHYxeCJ9.8ZNw6Dtu49tcNMuiQBdKPQ"
        />
      </DeckGL>
    </div>
  );
};

export default App;
