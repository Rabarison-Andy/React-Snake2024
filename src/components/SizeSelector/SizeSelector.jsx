import useStore from "../../utils/store";
import s from "./SizeSelector.module.scss";

const SizeSelector = () => {
  const { setBoardSize } = useStore();

  const handleSizeChange = (size) => {
    setBoardSize(size);
    window.dispatchEvent(new CustomEvent('boardSizeChanged'));
  };

  return (
    <div className={s.wrapper}>
      <button onClick={() => handleSizeChange(0.7)}>Small</button>
      <button onClick={() => handleSizeChange(1)}>Normal</button>
      <button onClick={() => handleSizeChange(1.15)}>Large</button>
    </div>
  );
};

export default SizeSelector; 