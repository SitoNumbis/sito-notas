import { useState } from "react";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import {
  useNotification,
  Loading,
  InputControl,
  IconButton,
  Button,
} from "@sito/ui";

// services
import { updatePassword } from "../../../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Password() {
  const { setNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setShowRPassword] = useState(false);

  const handleRPassword = (e) => setRPassword(e.target.value);

  const toggleShowRPassword = () => setShowRPassword((oldValue) => !oldValue);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setPasswordHelperText("");
    if (!password.length) {
      document.getElementById("password")?.focus();
      setPasswordHelperText("Debes introducir tu contraseña");
      return;
    }
    if (password !== rPassword) {
      document.getElementById("password")?.focus();
      setPasswordHelperText("No coinciden las contraseñas");
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    if (error && error !== null)
      setNotification({ type: "error", message: error.message });
    else {
      setPassword("");
      setRPassword("");
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col gap-3 ">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 justify-start items-start"
      >
        <h3 className="text-xl">Seguridad</h3>
        <InputControl
          id="password"
          className="w-full"
          label="Contraseña"
          maxLength={25}
          value={password}
          onChange={handlePassword}
          disabled={loading}
          type={!showPassword ? "password" : "string"}
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
        <InputControl
          id="rPassword"
          className="w-full"
          label="Repetir Contraseña"
          maxLength={25}
          value={rPassword}
          onChange={handleRPassword}
          disabled={loading}
          type={!showRPassword ? "password" : "string"}
          leftComponent={
            <IconButton
              tabIndex={-1}
              name="toggle-see-r-password"
              onClick={toggleShowRPassword}
              icon={
                <FontAwesomeIcon icon={showRPassword ? faLockOpen : faLock} />
              }
              className="-ml-3"
              aria-label="click para alternar ver/ocultar repetir contraseña"
            />
          }
        />
        <Button
          type="submit"
          shape="filled"
          className="button-loading"
          disabled={loading}
        >
          {loading ? <Loading color="basics" strokeWidth="8" /> : "Guardar"}
        </Button>
      </form>
    </section>
  );
}

export default Password;
