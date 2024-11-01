import { CvForm } from "./components/layout/CvForm";

function App() {
  return (
    <div className="container-fluid flex gap-10 p-10">
      <CvForm />
      <div className="w-1/2">Preview</div>
    </div>
  );
}

export default App;
