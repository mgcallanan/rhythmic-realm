import React from "react";

export default class SongSelect extends React.Component {
  render() {
    const { label = "select", onChange = () => {} } = this.props;
    const changeHandler = (e) => {
      console.log(e);
      onChange(e.target.value);
    };
    return (
      <div>
        <label>{label}</label>
        <select name="songs" id="cars" onChange={changeHandler}>
          <option value="flowers">Flowers</option>
          <option value="alaska">Alaska</option>
          <option value="liz">Liz</option>
          <option value="good4u">good 4 u</option>
        </select>
      </div>
    );
  }
}
