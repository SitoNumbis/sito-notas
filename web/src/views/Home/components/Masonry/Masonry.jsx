import React, { useCallback, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

// components
import Task from "../Task/Task";
import NoNotes from "../NoNotes";
import PrintAfter from "../../../../components/PrintAfter/PrintAfter";

function Masonry({
  elements,
  tags,
  onDelete,
  onDeleteTag,
  onAdd,
  onChangeTag,
}) {
  const element = useCallback(
    (tag) => {
      const filteredByTags = elements.filter((element) => element.tag === tag);
      if (filteredByTags.length)
        return filteredByTags.map((item) => (
          <li key={item.id}>
            <PrintAfter delay={150} animation="aGrow">
              <Task id={item.id} onDelete={onDelete} />
            </PrintAfter>
          </li>
        ));
      return <NoNotes />;
    },
    [elements, tags, onDelete]
  );

  const cols = useMemo(() => {
    return tags.map((tag) => (
      <div
        key={tag}
        className="w-[300px] border-dashed rounded-xl border-dark-gray border-[1px] p-3"
      >
        <div className="group flex flex-col">
          <div className="flex gap-3 items-center">
            <h2
              contentEditable
              onInput={(e) => onChangeTag(e.target.innerText, tag)}
              className="text-2xl font-semibold text-sdark dark:text-secondary "
            >
              {tag}
            </h2>
            <button
              type="button"
              name="delete-tag"
              onClick={() => onDeleteTag(tag)}
              className="opacity-0 group-hover:opacity-[1] text-error hover:bg-pdark-hover icon-button"
              aria-label="click para eliminar esta etiqueta con todas sus notas"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <div className="w-full grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
            <div className="overflow-hidden transition duration-300 opacity-0 group-hover:opacity-[1] items-center flex justify-center w-full">
              <div className="w-full border-dashed border-secondary border-[1px]" />
              <button
                type="button"
                name="add-task"
                onClick={() => onAdd(tag)}
                className="secondary icon-button"
                aria-label="click para agregar una nueva nota"
              >
                <FontAwesomeIcon icon={faAdd} />
              </button>
              <div className="w-full border-dashed border-secondary border-[1px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">{element(tag)}</div>
      </div>
    ));
  }, [element]);

  return (
    <ul className="flex w-full">
      {cols}
      <div></div>
    </ul>
  );
}

export default Masonry;
