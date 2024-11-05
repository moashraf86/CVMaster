import { useFormStore } from "../../store/useFormStore";

export const HeaderPreview: React.FC = () => {
  // get the data from the store
  const { formData } = useFormStore();
  // destructure the data from the form data
  const { name, title, email, phone, linkedin, otherLink, location } =
    formData.personalInfo[0];
  return (
    <header className="text-center font-roboto">
      <h1 className="text-4xl font-bold">{name}</h1>
      <p className="text-lg">{title}</p>
      {location && <p className="text-lg">{location}</p>}
      <span className="me-2">{phone}</span>
      <a className="me-1" href={email}>
        {email}
      </a>
      <a className="me-1" href={linkedin}>
        LinkedIn
      </a>
      <a href={otherLink}>Github</a>
    </header>
  );
};
