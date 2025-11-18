import { useState } from "react";

export const Login = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="w-dvw h-dvh flex flex-row items-center justify-center">
      <div className="flex flex-col justify-center items-baseline rounded-xl border border-gray-500 w-96 p-6 gap-3">
        <p className="text-2xl text-gray-800">Please Enter your name.</p>
        <input
          className="border w-full mt-7 mb-2 border-gray-500 rounded-sm outline-0 p-2"
          type="text"
          value={name}
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <button className="rounded-sm bg-black text-white pt-2 pb-2 pl-4 pr-4">Submit</button>
        </div>
      </div>
    </div>
  );
};
