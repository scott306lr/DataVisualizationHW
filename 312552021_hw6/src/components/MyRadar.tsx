import { ResponsiveRadar } from "@nivo/radar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyRadar: React.FC<{ data: any }> = ({ data }) => {
  console.log(data);
  const _data = [
    {
      taste: "fruity",
      chardonay: 88,
      carmenere: 87,
      syrah: 34,
    },
    {
      taste: "bitter",
      chardonay: 88,
      carmenere: 41,
      syrah: 30,
    },
    {
      taste: "heavy",
      chardonay: 107,
      carmenere: 86,
      syrah: 24,
    },
    {
      taste: "strong",
      chardonay: 93,
      carmenere: 41,
      syrah: 59,
    },
    {
      taste: "sunny",
      chardonay: 29,
      carmenere: 25,
      syrah: 106,
    },
  ];

  return (
    //center
    <div className="flex h-full w-full justify-center rounded-xl border-2 border-gray-500 bg-white">
      <ResponsiveRadar
        data={_data}
        keys={["chardonay", "carmenere", "syrah"]}
        indexBy="taste"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="catmullRomClosed"
        borderColor={{ from: "color" }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        colors={{ scheme: "nivo" }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default MyRadar;
