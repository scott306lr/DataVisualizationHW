import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyCirclePacking: React.FC<{ data: any }> = ({ data }) => {
  console.log(data);
  const _data = {
    name: "nivo",
    color: "hsl(320, 70%, 50%)",
    children: [
      {
        name: "viz",
        color: "hsl(281, 70%, 50%)",
        children: [
          {
            name: "stack",
            color: "hsl(235, 70%, 50%)",
            children: [
              {
                name: "cchart",
                color: "hsl(1, 70%, 50%)",
                loc: 167923,
              },
              {
                name: "xAxis",
                color: "hsl(141, 70%, 50%)",
                loc: 59653,
              },
              {
                name: "yAxis",
                color: "hsl(206, 70%, 50%)",
                loc: 48282,
              },
              {
                name: "layers",
                color: "hsl(341, 70%, 50%)",
                loc: 176469,
              },
            ],
          },
          {
            name: "ppie",
            color: "hsl(82, 70%, 50%)",
            children: [
              {
                name: "chart",
                color: "hsl(95, 70%, 50%)",
                children: [
                  {
                    name: "pie",
                    color: "hsl(322, 70%, 50%)",
                    children: [
                      {
                        name: "outline",
                        color: "hsl(12, 70%, 50%)",
                        loc: 40349,
                      },
                      {
                        name: "slices",
                        color: "hsl(215, 70%, 50%)",
                        loc: 91423,
                      },
                      {
                        name: "bbox",
                        color: "hsl(342, 70%, 50%)",
                        loc: 6404,
                      },
                    ],
                  },
                  {
                    name: "donut",
                    color: "hsl(110, 70%, 50%)",
                    loc: 149264,
                  },
                  {
                    name: "gauge",
                    color: "hsl(358, 70%, 50%)",
                    loc: 61340,
                  },
                ],
              },
              {
                name: "legends",
                color: "hsl(4, 70%, 50%)",
                loc: 70584,
              },
            ],
          },
        ],
      },
      {
        name: "colors",
        color: "hsl(90, 70%, 50%)",
        children: [
          {
            name: "rgb",
            color: "hsl(1, 70%, 50%)",
            loc: 141034,
          },
          {
            name: "hsl",
            color: "hsl(247, 70%, 50%)",
            loc: 198706,
          },
        ],
      },
      {
        name: "utils",
        color: "hsl(347, 70%, 50%)",
        children: [
          {
            name: "randomize",
            color: "hsl(94, 70%, 50%)",
            loc: 42282,
          },
          {
            name: "resetClock",
            color: "hsl(39, 70%, 50%)",
            loc: 173697,
          },
          {
            name: "noop",
            color: "hsl(182, 70%, 50%)",
            loc: 66203,
          },
          {
            name: "tick",
            color: "hsl(327, 70%, 50%)",
            loc: 140803,
          },
          {
            name: "forceGC",
            color: "hsl(93, 70%, 50%)",
            loc: 193974,
          },
          {
            name: "stackTrace",
            color: "hsl(164, 70%, 50%)",
            loc: 191202,
          },
          {
            name: "dbg",
            color: "hsl(243, 70%, 50%)",
            loc: 132448,
          },
        ],
      },
      {
        name: "generators",
        color: "hsl(340, 70%, 50%)",
        children: [
          {
            name: "address",
            color: "hsl(289, 70%, 50%)",
            loc: 178563,
          },
          {
            name: "city",
            color: "hsl(238, 70%, 50%)",
            loc: 170318,
          },
          {
            name: "animal",
            color: "hsl(100, 70%, 50%)",
            loc: 123606,
          },
          {
            name: "movie",
            color: "hsl(245, 70%, 50%)",
            loc: 189151,
          },
          {
            name: "user",
            color: "hsl(195, 70%, 50%)",
            loc: 94003,
          },
        ],
      },
      {
        name: "set",
        color: "hsl(281, 70%, 50%)",
        children: [
          {
            name: "clone",
            color: "hsl(254, 70%, 50%)",
            loc: 9782,
          },
          {
            name: "intersect",
            color: "hsl(175, 70%, 50%)",
            loc: 132411,
          },
          {
            name: "merge",
            color: "hsl(298, 70%, 50%)",
            loc: 58239,
          },
          {
            name: "reverse",
            color: "hsl(186, 70%, 50%)",
            loc: 180989,
          },
          {
            name: "toArray",
            color: "hsl(304, 70%, 50%)",
            loc: 124557,
          },
          {
            name: "toObject",
            color: "hsl(145, 70%, 50%)",
            loc: 38029,
          },
          {
            name: "fromCSV",
            color: "hsl(320, 70%, 50%)",
            loc: 120144,
          },
          {
            name: "slice",
            color: "hsl(138, 70%, 50%)",
            loc: 191881,
          },
          {
            name: "append",
            color: "hsl(58, 70%, 50%)",
            loc: 43648,
          },
          {
            name: "prepend",
            color: "hsl(167, 70%, 50%)",
            loc: 59036,
          },
          {
            name: "shuffle",
            color: "hsl(134, 70%, 50%)",
            loc: 184820,
          },
          {
            name: "pick",
            color: "hsl(29, 70%, 50%)",
            loc: 170600,
          },
          {
            name: "plouc",
            color: "hsl(209, 70%, 50%)",
            loc: 189961,
          },
        ],
      },
      {
        name: "text",
        color: "hsl(234, 70%, 50%)",
        children: [
          {
            name: "trim",
            color: "hsl(5, 70%, 50%)",
            loc: 48431,
          },
          {
            name: "slugify",
            color: "hsl(93, 70%, 50%)",
            loc: 22290,
          },
          {
            name: "snakeCase",
            color: "hsl(34, 70%, 50%)",
            loc: 22498,
          },
          {
            name: "camelCase",
            color: "hsl(264, 70%, 50%)",
            loc: 28421,
          },
          {
            name: "repeat",
            color: "hsl(345, 70%, 50%)",
            loc: 101317,
          },
          {
            name: "padLeft",
            color: "hsl(22, 70%, 50%)",
            loc: 127022,
          },
          {
            name: "padRight",
            color: "hsl(348, 70%, 50%)",
            loc: 1172,
          },
          {
            name: "sanitize",
            color: "hsl(354, 70%, 50%)",
            loc: 149977,
          },
          {
            name: "ploucify",
            color: "hsl(125, 70%, 50%)",
            loc: 4396,
          },
        ],
      },
      {
        name: "misc",
        color: "hsl(118, 70%, 50%)",
        children: [
          {
            name: "greetings",
            color: "hsl(269, 70%, 50%)",
            children: [
              {
                name: "hey",
                color: "hsl(1, 70%, 50%)",
                loc: 176440,
              },
              {
                name: "HOWDY",
                color: "hsl(78, 70%, 50%)",
                loc: 192395,
              },
              {
                name: "aloha",
                color: "hsl(97, 70%, 50%)",
                loc: 196568,
              },
              {
                name: "AHOY",
                color: "hsl(6, 70%, 50%)",
                loc: 79826,
              },
            ],
          },
          {
            name: "other",
            color: "hsl(307, 70%, 50%)",
            loc: 55297,
          },
          {
            name: "path",
            color: "hsl(183, 70%, 50%)",
            children: [
              {
                name: "pathA",
                color: "hsl(47, 70%, 50%)",
                loc: 120932,
              },
              {
                name: "pathB",
                color: "hsl(135, 70%, 50%)",
                children: [
                  {
                    name: "pathB1",
                    color: "hsl(282, 70%, 50%)",
                    loc: 29394,
                  },
                  {
                    name: "pathB2",
                    color: "hsl(143, 70%, 50%)",
                    loc: 151876,
                  },
                  {
                    name: "pathB3",
                    color: "hsl(35, 70%, 50%)",
                    loc: 192079,
                  },
                  {
                    name: "pathB4",
                    color: "hsl(231, 70%, 50%)",
                    loc: 176212,
                  },
                ],
              },
              {
                name: "pathC",
                color: "hsl(43, 70%, 50%)",
                children: [
                  {
                    name: "pathC1",
                    color: "hsl(204, 70%, 50%)",
                    loc: 159858,
                  },
                  {
                    name: "pathC2",
                    color: "hsl(329, 70%, 50%)",
                    loc: 178554,
                  },
                  {
                    name: "pathC3",
                    color: "hsl(302, 70%, 50%)",
                    loc: 108481,
                  },
                  {
                    name: "pathC4",
                    color: "hsl(64, 70%, 50%)",
                    loc: 41990,
                  },
                  {
                    name: "pathC5",
                    color: "hsl(51, 70%, 50%)",
                    loc: 45077,
                  },
                  {
                    name: "pathC6",
                    color: "hsl(92, 70%, 50%)",
                    loc: 102585,
                  },
                  {
                    name: "pathC7",
                    color: "hsl(165, 70%, 50%)",
                    loc: 30722,
                  },
                  {
                    name: "pathC8",
                    color: "hsl(247, 70%, 50%)",
                    loc: 67835,
                  },
                  {
                    name: "pathC9",
                    color: "hsl(236, 70%, 50%)",
                    loc: 80292,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const [highlightID, setHighlightID] = useState<number | null>(null);
  return (
    //center
    <div className="flex h-full w-full justify-center rounded-xl border-2 border-gray-500 bg-white">
      <ResponsiveCirclePacking
        enableLabels
        labelsSkipRadius={16}
        labelsFilter={(label) => label.node.height === 0}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        zoomedId={zoomedId}
        motionConfig="gentle"
        onClick={(node) => {
          setZoomedId(zoomedId === node.id ? null : node.id);
        }}
        data={_data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="loc"
        colors={{ scheme: "nivo" }}
        childColor={{
          from: "color",
          modifiers: [["brighter", 0.4]],
        }}
        padding={4}
        // labelsFilter={(n) => 2 === n.node.depth}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.5]],
        }}
        onMouseEnter={(node) => setHighlightID(node.height)}
        onMouseLeave={() => setHighlightID(null)}
        defs={[
          {
            id: "lines",
            type: "patternLines",
            background: "none",
            color: "inherit",
            rotation: -45,
            lineWidth: 5,
            spacing: 8,
          },
        ]}
        fill={[
          {
            match: {
              depth: highlightID,
            },
            id: "lines",
          },
        ]}
      />
    </div>
  );
};

export default MyCirclePacking;
