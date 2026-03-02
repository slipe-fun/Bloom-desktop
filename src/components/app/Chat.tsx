import TextInput from "../ui/TextInput.tsx";
import Button from "../ui/Button.tsx";
import React, {useState} from "react";

export function Chat()
{
    const [message, setMessage] = useState("");

    const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        alert(message)
    }

    return (
        <div style={styles.container}>
            <form onSubmit={sendMessage} style={styles.form}>
                <TextInput
                    style={styles.input}
                    icon=""
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi!" // TODO: Translate ts into Russian probably.
                    required
                />
                <Button
                    style={styles.button}
                    type="submit"
                >
                    Send
                </Button>
            </form>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: "99vh",
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: 0,
        padding: 0,
    },
    input: {
        flexGrow: 1,
    },
    button: {
        width: '25%',
        height: '42px',
    }
}
