import { z } from "zod";
import { TrainerResponseSchema } from "../../assets/schemas/trainer.schema";
import { useNavigate } from "react-router-dom";

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];
interface TrainersSelectedToBattlePropos {
    selectedTrainers: Trainer[];
}
export function TrainersSelectedToBattle({ selectedTrainers }: TrainersSelectedToBattlePropos) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center">
            {selectedTrainers.length < 2 ? (
                <h1 className="font-bold text-red-400">Please, select 2 trainers</h1>
            ) : (
                <div className="bg-gray-200 w-96 rounded-lg border-gray-300 border-[1px] flex flex-col justify-center items-center font-bold">
                    {selectedTrainers.map((trainer) => (
                        <div key={trainer.id}>
                            <p>{trainer.name}</p>
                        </div>
                    ))}

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2"
                        onClick={() => navigate('/arena')}
                    >
                        Battle
                    </button>
                </div>
            )}
        </div>
    )
}