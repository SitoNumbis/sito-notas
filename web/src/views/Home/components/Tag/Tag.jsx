import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faBrush,
  faFileDownload,
  faShareAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// components
import NoNotes from "./NoNotes";
import Task from "../Task/Task";
import PrintAfter from "../../../../components/PrintAfter/PrintAfter";

function Tag({
  tag,
  elements,
  onAdd,
  onDelete,
  onBrushTag,
  onChangeTag,
  onDeleteTag,
}) {

  const onDownload = () => {

  }

  const element = useMemo(() => {
    const filteredByTags = elements;
    if (filteredByTags.length)
      return filteredByTags.map((item) => (
        <li key={item.id}>
          <PrintAfter delay={150} animation="aGrow">
            <Task id={item.id} onDelete={onDelete} />
          </PrintAfter>
        </li>
      ));
    return <NoNotes />;
  }, [elements, elements, onAdd, onDelete, onChangeTag, onDeleteTag]);

  return (
    <div
      key={tag.id}
      id={tag.id}
      className={`appear min-w-[300px] max-w-[400px] border-dashed rounded-xl border-white-hover dark:border-dark-gray border-[1px] p-3 ${css(
        { background: `${tag.color}1c` }
      )}`}
    >
      <div className="group flex flex-col">
        <h2
          contentEditable
          onInput={(e) => onChangeTag(e.target.innerText, tag.id)}
          className="text-2xl font-semibold text-sdark dark:text-secondary "
        >
          {tag.id}
        </h2>

        <div className="w-full grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
          <div className="overflow-hidden transition duration-300 opacity-0 group-hover:opacity-[1] items-center flex justify-center w-full">
            <div className="secondary dashed-border" />
            <button
              type="button"
              name="add-task"
              onClick={() => onAdd(tag.id)}
              className="secondary icon-button"
              aria-label="click para agregar una nueva nota"
            >
              <FontAwesomeIcon icon={faAdd} />
            </button>
            <button
              type="button"
              name="share-tag"
              onClick={() => onShareTag(tag.id)}
              className=" text-primary hover:bg-pdark-hover icon-button"
              aria-label="click para compartir esta etiqueta con todas sus notas"
            >
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            <button
              type="button"
              name="brush-tag"
              onClick={() => onBrushTag(tag.id)}
              className="text-primary hover:bg-pdark-hover icon-button"
              aria-label="click para cambiar el color de esta etiqueta"
            >
              <FontAwesomeIcon icon={faBrush} />
            </button>
            <button
              type="button"
              name="download-tag"
              onClick={onDownload}
              className="text-primary hover:bg-pdark-hover icon-button"
              aria-label="click para descargar esta etiqueta con todas sus notas"
            >
              <FontAwesomeIcon icon={faFileDownload} />
            </button>
            <button
              type="button"
              name="delete-tag"
              onClick={() => onDeleteTag(tag.id)}
              className="text-error hover:bg-pdark-hover icon-button"
              aria-label="click para eliminar esta etiqueta con todas sus notas"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <div className="secondary dashed-border" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">{element}</div>
    </div>
  );
}

Tag.propTypes = {
  tag: PropTypes.shape({ id: PropTypes.string, color: PropTypes.string }),
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      tag: PropTypes.string,
      content: PropTypes.string,
    })
  ),
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onBrushTag: PropTypes.func,
  onChangeTag: PropTypes.func,
  onDeleteTag: PropTypes.func,
};

const TagMemo = memo(
  (props) => <Tag {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.tag.id === newProps.tag.id &&
      oldProps.tag.color === newProps.tag.color &&
      oldProps.elements === newProps.elements &&
      oldProps.onAdd === newProps.onAdd &&
      oldProps.onDelete === newProps.onDelete &&
      oldProps.onBrushTag === newProps.onBrushTag &&
      oldProps.onChangeTag === newProps.onDeleteTag
    );
  }
);

export default TagMemo;
