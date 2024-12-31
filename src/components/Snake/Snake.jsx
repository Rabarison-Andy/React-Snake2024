import useStore from "../../utils/store";
import s from "./Snake.module.scss";

const Snake = ({ data }) => {
  const { skin } = useStore();

  // console.log(data);

  const getStyle = (dot, i) => {
    let background = null;

    if (data[data.length - 1] === dot) {
      background = `url('/skin.jpg') 0 0`;
    } else {
      background = `url('/skin.jpg') ${10 * i}px 10px`;
    }

    const style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      background: background,
    };

    return style;
  };

  return (
    <>
      {data.map((dot, i) => (
        <div key={i} className={s.snakeDot} style={getStyle(dot, i)}></div>
      ))}
    </>
  );
};

export default Snake;
