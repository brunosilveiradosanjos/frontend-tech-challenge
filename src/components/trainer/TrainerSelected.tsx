import { z } from "zod";
import { TrainerResponseSchema } from "../../assets/schemas/trainer.schema";

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];
interface TrainerSelectedPropos {
    selectedTrainers: Trainer[];
}
export function TrainerSelected({ selectedTrainers }: TrainerSelectedPropos) {
    return (
        <div className="flex flex-col justify-center items-center">
            {selectedTrainers.length > 0 ? (
                <div className="bg-gray-200 w-96 rounded-lg border-gray-300 border-[1px] flex flex-col justify-center items-center font-bold">
                    {selectedTrainers.map((trainer) => (
                        <div key={trainer.id}>
                            <p>{trainer.name}</p>
                        </div>
                    ))}
                </div>
            ) : (<h1 className="font-bold text-red-400">Please, select 2 trainers</h1>)}
        </div>
    )
}