import styles from "./Item.module.css";
import { getIcon, icons } from "../assets/icons";

import { Ratio } from "react-bootstrap";

import { ReactUtils } from "@maneren/utils";
const cls = ReactUtils.classListBuilder(styles);

const getExtension = (filename) => filename.toLowerCase().split(".").pop();

const Icon = ({ icon, alt }) => (
  <Ratio aspectRatio="1x1">
    <img alt={alt} className={cls("icon")} src={icon} />
  </Ratio>
);

const File = ({ name, path }) => (
  <div className={cls("item file")}>
    <a href={`${encodeURIComponent(path)}`} className={cls("link")} download>
      <Icon alt="file icon" icon={getIcon(getExtension(name))} />
      <div className={cls("name")}>{name}</div>
    </a>
  </div>
);

const Folder = ({ name, path, onClick, icon }) => (
  <div className={cls("item folder")}>
    <span className={cls("link")} onClick={onClick}>
      <Icon alt="folder icon" icon={icons[icon]} />
      <div className={cls("name")}>{name}</div>
    </span>
  </div>
);

export { File, Folder };
