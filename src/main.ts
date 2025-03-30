import "./bg.ts";
import "./brake-check.css";

addFormHandlers();
function addFormHandlers() {
  const speedInput : HTMLInputElement = document.querySelector("#speed")!;
  const speedUnitInput : HTMLSelectElement = document.querySelector("#speed_unit")!;
  const totalSpeedInput : HTMLInputElement = document.querySelector("#speedms")!;
  
  speedInput.onchange = () => updater();
  speedUnitInput.onchange = () => updater();
  const updater = () => totalSpeedInput.value = (Number(speedInput.value) * Number(speedUnitInput.value)).toString();
}