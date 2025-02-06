import { Link, useLocation } from "react-router-dom";
import Achievements from "./Achievements";
import EditProfile from "./EditProfile";
import { useState } from "react";


export default function PickedOption() {
    const location = useLocation()
    const [options, setOpetions] = useState("achievements")
    return (
        <div className="w-full xl:h-[90vh] h-fit py-8 px-6 rounded-lg bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <section className=" text-sm tracking-wide flex flex-row  text-gray-500">
                <button onClick={() => setOpetions("achievements")} className={`w-44 pb-2 border-b-2 ${options === "achievements" ? "text-red-800 border-red-600" : "border-gray-200"}`}>Achievements</button>
                <button onClick={() => setOpetions("edit")} className={`w-44 pb-2 border-b-2 ${options === "edit" ? "text-red-800 border-red-600" : "border-gray-200"}`}>Account Setting</button>
            </section>
            {options === "achievements" ?
                <Achievements />
                :
                <EditProfile />
            }
        </div>
    )

}