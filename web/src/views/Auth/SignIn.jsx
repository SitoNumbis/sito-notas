import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @sito/ui
import {
  useNotification,
  Loading,
  InputControl,
  IconButton,
  Button,
  Switcher,
} from "@sito/ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faUser } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../providers/UserProvider";

// components
import ModeButton from "../../components/ModeButton/ModeButton";

// services
import { login } from "../../services/auth";
import { createSettingsUser, fetchUserData } from "../../services/user";

// auth
import { saveUser } from "../../utils/auth";

// lang
import { showError } from "../../lang/es";

// styles
import "./styles.css";

function SignIn() {
  const { setNotification } = useNotification();

  const [user, setUser] = useState("");
  const [userHelperText, setUserHelperText] = useState("");

  const handleUser = (e) => setUser(e.target.value);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const navigate = useNavigate();

  const { setUserState } = useUser();

  const [loading, setLoading] = useState(false);

  const [remember, setRemember] = useState(true);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setUserHelperText("");
      setPasswordHelperText("");

      if (!user.length) {
        document.getElementById("user")?.focus();
        setUserHelperText("Debes introducir un correo electrónico");
        setLoading(false);
        return;
      }
      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText("Debes introducir tu contraseña");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await login(user, password, remember);
      const { data, error } = response;

      if (error && error !== null)
        setNotification({ type: "error", message: showError(error.message) });
      else {
        const userData = await fetchUserData(data.user.id);
        if (userData.error && userData.error !== null) {
          setNotification({
            type: "error",
            message: showError(userData.error.message),
          });
          setLoading(false);
        }
        if (!userData.data.length) await createSettingsUser(data.user.id);
        setUserState({
          type: "logged-in",
          user: data.user,
          photo: userData.data[0]?.photo ?? {},
        });
        saveUser({
          user: data.user,
          photo: userData.data[0]?.photo ?? {},
        });
        navigate("/");
      }
      setLoading(false);
    },
    [user, password, remember, setNotification, setUserState, navigate]
  );

  return (
    <main className="w-full viewport flex items-center justify-center">
      <ModeButton color="primary" className="top-1 right-1" />
      <div
        className={`bg-light-dark dark:bg-dark-dark fixed top-0 left-0 z-10 w-full h-screen flex items-center backdrop-blur-[1rem] transition-all duration-100 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Loading
          className={`bg-light-default dark:bg-dark-default transition-all duration-300  ${
            loading ? "!h-[100px]" : "!h-[0px]"
          }`}
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="form bg-light-dark dark:bg-dark-dark appear"
      >
        <div className="flex gap-2 items-start flex-col">
          {/* <img src={logo} alt="stick notes logo" className="w-10 h-10" /> */}
          LOGO
          <h1 className="primary uppercase text-4xl">Sito Notas</h1>
        </div>
        <InputControl
          id="user"
          label="Correo electrónico"
          className="sign-in-input"
          value={user}
          onChange={handleUser}
          leftComponent={
            <div className="icon-button button -ml-3">
              <FontAwesomeIcon className="primary" icon={faUser} />
            </div>
          }
          helperText={userHelperText}
        />
        <InputControl
          id="password"
          className="sign-in-input "
          value={password}
          onChange={handlePassword}
          type={!showPassword ? "password" : "text"}
          label="Contraseña"
          leftComponent={
            <IconButton
              tabIndex={-1}
              name="toggle-see-password"
              onClick={toggleShowPassword}
              icon={
                <FontAwesomeIcon icon={showPassword ? faLockOpen : faLock} />
              }
              className="-ml-3"
              aria-label="click para alternar ver/ocultar contraseña"
            />
          }
          helperText={passwordHelperText}
        />
        <Switcher
          checked={remember}
          value={remember}
          label="Recordarme"
          activeColor="primary"
          inactiveColor="basics"
          onChange={() => setRemember((remember) => !remember)}
        />
        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/auth/sign-up" className="underline primary">
            Registrarme
          </Link>
        </p>
        <div className="w-full flex gap-5 justify-end items-center">
          <Button
            name="login"
            type="submit"
            color="primary"
            shape="filled"
            aria-label="Click para entrar"
          >
            Entrar
          </Button>
        </div>
      </form>
    </main>
  );
}

export default SignIn;
