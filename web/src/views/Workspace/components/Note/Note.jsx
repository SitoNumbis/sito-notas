import React, { memo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

import PropTypes from "prop-types";

import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

import {
  faEdit,
  faSave,
  faTrash,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";

// css
import { css } from "@emotion/css";

// manager
import { getNote, updateNote } from "./local";

// lazy load
const FloatingButton = loadable(() => import("../../../../components/FAB/FAB"));
const IconButton = loadable(() =>
  import("../../../../components/IconButton/IconButton")
);

// styles
import "./styles.css";

function Note({ id, onDelete, onSave }) {
  const [value, setValue] = useState(getNote(id)?.content);

  const onLocalDelete = () => {
    onDelete(id);
    const dom = document.getElementById(id);
    dom?.classList.add("aShrink");
    setTimeout(() => {
      dom.style.display = "none";
    }, 400);
  };

  const [editing, setEditing] = useState(false);

  const onDownload = () => {
    const noteToDownload = getNote(id);
    const data = "data:text/json;charset=utf-8,";
    const json = encodeURIComponent(JSON.stringify(noteToDownload));
    const filename = `note-${id}.json`;
    const link = document.createElement("a");
    link.setAttribute("href", data + json);
    link.setAttribute("download", filename);
    link.click();
    setTimeout(() => {
      link.remove();
    }, 400);
  };

  const onLocalEdit = () => setEditing(true);

  const onLocalSave = useCallback(() => {
    updateNote(id, "content", value);
    setEditing(false);
    onSave({ id, content: value });
  }, [value, id]);

  const onEscapePress = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onLocalSave();
        e.target.blur();
      }
    },
    [onLocalSave]
  );

  useEffect(() => {
    window.addEventListener("keydown", onEscapePress);
    const fullscreenButton = document.querySelectorAll(
      '[data-name="fullscreen"]'
    )[0];
    if (fullscreenButton)
      fullscreenButton.addEventListener("click", onLocalSave);

    const a = document.getElementsByClassName("w-md-editor-text-input ")[0];
    if (a) {
      a.style.cssText = "font-family: inherit !important";
    }
    return () => {
      window.removeEventListener("keydown", onEscapePress);
      const fullscreenButton = document.querySelectorAll(
        '[data-name="fullscreen"]'
      )[0];
      if (fullscreenButton)
        fullscreenButton.removeEventListener("click", onLocalSave);
    };
  }, [editing, onLocalSave]);

  return (
    <article
      id={id}
      className={`note appear group bg-primary shadow-md shadow-[black] rounded-sm min-h-[350px] w-[300px] min-w-[300px] overflow-auto`}
    >
      {editing ? (
        <FloatingButton
          icon={faSave}
          onClick={onLocalSave}
          className="primary !fixed z-[999999]"
        />
      ) : null}
      <div
        className={`grid ${css({
          transition: "all 500ms ease",
          gridTemplateRows: "0fr",
        })} group-hover:grid-rows-[1fr] ${
          editing ? "!grid-rows-[1fr]" : ""
        } pointer-events-none group-hover:pointer-events-auto`}
      >
        <div className="flex overflow-hidden bg-dark-drawer-background w-full justify-end">
          <Link to={`/?note=${id}`}>
            <IconButton
              type="button"
              name="edit-note"
              icon={editing ? faSave : faEdit}
              tooltip={editing ? "Guardar" : "Editar"}
              onClick={editing ? onLocalSave : onLocalEdit}
              aria-label="click para editar"
              className="text-secondary p-3 hover:text-primary hover:bg-sdark !rounded-[0px]"
            />
          </Link>
          <IconButton
            name="download-note"
            onClick={onDownload}
            icon={faFileDownload}
            tooltip="Descargar nota"
            aria-label="click para descargar"
            className="text-secondary p-3 hover:text-primary hover:bg-sdark !rounded-[0px]"
          />
          <IconButton
            icon={faTrash}
            tooltip="Eliminar"
            name="delete-note"
            onClick={onLocalDelete}
            aria-label="click para borrar"
            className="text-error p-3 hover:text-primary hover:bg-sdark !rounded-[0px]"
          />
        </div>
      </div>
      <div className="p-5">
        <div className="mt-2">
          {!editing ? (
            <MarkdownPreview
              source={value}
              className={`w-full ${css({
                backgroundColor: "initial",
                color: "#222",
              })}`}
            />
          ) : (
            <MDEditor value={value} onChange={setValue} fullscreen />
          )}
        </div>
      </div>
    </article>
  );
}

Note.propTypes = {
  id: PropTypes.string.isRequired,
};

const NoteMemo = memo(
  ({ id, onDelete, onSave }) => (
    <Note id={id} onDelete={onDelete} onSave={onSave} />
  ),
  (oldProps, newProps) => {
    return (
      oldProps.id === newProps.id &&
      oldProps.onDelete === newProps.onDelete &&
      oldProps.onSave === newProps.onSave
    );
  }
);

NoteMemo.displayName = "Note";

export default NoteMemo;
