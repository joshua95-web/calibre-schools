"use client";

import TextReadInput from "./text-read-input";

const handleChange = (e) => {
  console.log(e.target.value);
};

interface PostSignupFormProps {
  neonUser: {
    first_name?: string;
    last_name?: string;
    prefix?: string;
    mobile?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function PostSignupForm({
  neonUser,
  user,
}: PostSignupFormProps) {
  return (
    <div>
      <div className=" text-3xl text-black font-extrabold ">
        <h1>We need some more information...</h1>
        <form>
          <TextReadInput
            label="First Name"
            type="text"
            name="first_name"
            value={neonUser?.first_name}
            placeholder="First Name"
            onChange={handleChange}
          />
          <TextReadInput
            label="Last Name"
            type="text"
            name="last_name"
            value={neonUser?.first_name}
            placeholder="Last Name"
            onChange={handleChange}
          />
          <TextReadInput
            label="Prefix"
            type="text"
            name="prefix"
            value={neonUser?.prefix}
            placeholder="Prefix"
            onChange={handleChange}
          />
          <TextReadInput
            label="Mobile"
            type="text"
            name="Mobile"
            value={neonUser?.mobile}
            placeholder="Mobile"
            onChange={handleChange}
          />
        </form>
        <div className="flex justify-between"></div>
      </div>
      Neon data
      <pre>{JSON.stringify(neonUser, null, 2)}</pre>
      <div>
        Clerk data
        <pre>{JSON.stringify(user, null, 2)}</pre>;
      </div>
    </div>
  );
}
