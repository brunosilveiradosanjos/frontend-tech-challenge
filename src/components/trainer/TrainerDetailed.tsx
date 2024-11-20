interface TrainerDetailedProps {
    id: number;
}
export function TrainerDetailed({ id }: TrainerDetailedProps) {

    return (
        <div className="w-full" >
            Trainer Detailed {id}
        </div>
        // <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        //     Trainer Detailed {id}
        // </div>
    )
}