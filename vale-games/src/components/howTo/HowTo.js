import React from "react";
import styles from "./howTo.module.css";

function HowTo ({summary, controls}) {
    return (
        <>
            <section className={styles.summary}>
                <h2>Summary</h2>
                <p>{summary}</p>
            </section>
            <section className={styles.controls}>
                <h2>Controls</h2>
                <ul>
                    {controls.map((control, index) => (
                        <li key={index}>{control}</li>
                    ))}
                </ul>
            </section>
        </>
    )
}


export default HowTo;