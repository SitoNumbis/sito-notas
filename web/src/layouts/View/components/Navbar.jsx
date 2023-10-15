import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

// utils
import { utilsToggleTheme } from "../../../utils/functions";

// contexts
import { useMode } from "../../../contexts/ModeProvider";

// components
import SearchWrapper from "./SearchWrapper/SearchWrapper";
import IconButton from "../../../components/IconButton/IconButton";

// images
import logo from "../../../assets/images/logo.png";

// styles
import "./styles.css";

export default function Navbar() {
  const { modeState, toggleModeState } = useMode();

  return (
    <header className="w-full fixed top-0 left-0 z-50 dark:bg-dark-background2 bg-light-background">
      <nav className="w-full flex items-center h-full py-5 px-5 justify-between flex-wrap">
        <div className="flex gap-2 items-center">
          <img src={logo} alt="stick notes logo" className="w-10 h-10" />
          <h1 className="text-sdark dark:text-secondary uppercase">
            Sito Notas
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <SearchWrapper />
          <IconButton
            name="toggle-theme"
            onClick={() => {
              toggleModeState();
              utilsToggleTheme();
            }}
            tooltip={!modeState ? "Tema claro" : "Tema oscuro  "}
            icon={!modeState ? faSun : faMoon}
            className="icon-button secondary"
            ariaLabel="Click para cambiar el tema"
          />
        </div>
      </nav>
    </header>
  );
}
