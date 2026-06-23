import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();

  const flag =
    countries.find((country) => country.names.common === defaultCountry)?.codes
      .alpha_2 ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
      required
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option
          key={c.names.common}
          value={`${c.names.common}%${c.codes.alpha_2}`}
        >
          {c.names.common}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
