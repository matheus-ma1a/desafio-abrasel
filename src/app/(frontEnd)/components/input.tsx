import { InputProps } from "@/types/types";


function input(props: InputProps) {

    return (
        <input
            id={props.id}
            name={props.name}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${props.className}`}
        />
    );
}

export default input;