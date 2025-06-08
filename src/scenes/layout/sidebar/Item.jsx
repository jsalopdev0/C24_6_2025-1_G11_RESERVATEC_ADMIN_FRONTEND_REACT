/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  return (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={icon}
      rootStyles={{
        color: path === location.pathname && "#00B2E2", // reemplazado el morado
      }}
      
    >
      {title}
    </MenuItem>
  );
};

export default Item;
