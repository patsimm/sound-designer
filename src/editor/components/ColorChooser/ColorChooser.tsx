import "./ColorChooser.scss";

import classNames from "classnames";

export type ColorChooserProps = {
  colors: string[];
  onColorChosen?: (color: string) => void;
};

function ColorChooser({ colors, onColorChosen }: ColorChooserProps) {
  return (
    <div className={classNames("color-chooser")}>
      {colors.map((color) => (
        <button
          key={color}
          className={classNames("color-chooser__color-button")}
          style={{
            background: color,
          }}
          onClick={() => {
            onColorChosen?.(color);
          }}
        />
      ))}
    </div>
  );
}

export default ColorChooser;
