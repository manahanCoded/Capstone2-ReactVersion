import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";


export default function Unit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [checkUser, setCheckUser] = useState();
    const [units, setUnits] = useState([]);
    const [userScores, setUserScores] = useState([]);


    useEffect(() => {
        async function checkUserStatus() {
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
                const data = await res.json();
                setCheckUser(data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        navigate("/user/login");
                    }
                } else {
                    alert("Failed to fetch user profile.");
                    console.error(err);
                }
            }
        }

        checkUserStatus();
    }, [navigate]);

    // Fetch units data and user scores
    useEffect(() => {
        async function fetchUnitsAndScores() {
            try {
                const unitsRes = await axios.get(`http://localhost:5000/api/module/module-units/${id}`);
                if (Array.isArray(unitsRes.data.listall)) {
                    setUnits(unitsRes.data.listall);
                } else {
                    setUnits([]);
                }

                if (checkUser) {
                    const scoresRes = await axios.get(`http://localhost:5000/api/module/get-user-score/${checkUser?.id}`);
                    setUserScores(scoresRes.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load units or scores.");
            }
        }

        fetchUnitsAndScores();
    }, [id, checkUser]);



    return (
        <div className="h-screen mt-14 px-4">
            <MaxWidthWrapper className="py-8 w-[60%]">
                <h1 className="text-3xl font-bold mb-4">Units</h1>
                {checkUser?.role === "admin" ? (
                    <Link to={`/modules/create-unit/${id}`}
                        className="rounded-sm py-2 px-4 font-medium mr-2 border-[1px] border-gray-300 hover:bg-[#333333] hover:text-white"
                    >
                        Create Unit
                    </Link>
                ) : null}
                {units.length > 0 ? (
                    <div className="space-y-4">
                        {units.map((unit, index) => {

                            const userScore = userScores.find((score) => score.module_id === unit.id);
                            const isCompleted = userScore?.completed;
                            const score = userScore?.score || 0;
                            const passed = userScore?.passed ? "Passed" : "Not Passed";

                            return (
                                <div key={index} className="border-b border-gray-200 py-2 text-sm">
                                    <p className="text-lg font-semibold">{unit?.title}</p>
                                    {isCompleted ? (
                                        <div className=" text-gray-500 mt-2">
                                            <p>Score: {score}</p>
                                            <p>{passed}</p>
                                        </div>
                                    ) : (
                                        <div className=" text-red-500 mt-2">
                                            <p>Not completed yet</p>
                                        </div>
                                    )}
                                    <div className="flex flex-row items-center justify-end">
                                        {checkUser?.role === "admin" ? (
                                            <Link to={`/modules/units/edit/${unit.id}`}
                                                className="rounded-sm py-2 px-4 font-medium mr-2 border-[1px] border-gray-300 hover:bg-[#333333] hover:text-white"
                                            >
                                                Edit
                                            </Link>
                                        ) : null}
                                        <div className="group ">
                                            <Link
                                                to={`/modules/units/docs/${unit.id}`}
                                                className="rounded-sm py-2 px-4 font-medium  bg-[#333333] hover:bg-[#121212] text-white "
                                            >
                                                Start
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No units found.</div>
                )}
            </MaxWidthWrapper>
        </div>
    );
}
