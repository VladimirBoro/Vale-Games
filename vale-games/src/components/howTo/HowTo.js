import React from "react";
import styles from "./howTo.module.css";

function HowTo ({summary, controls}) {
    return (
        <div className={styles.component}>
            <section className={styles.summary}>
                <h2>Summary</h2>
                <p>{summary}</p>
            </section>

            <section className={styles.summary}>
                <h2>Controls</h2>
                <ul>
                    {controls.map((control, index) => (
                        <li key={index}>
                            {control}
                        </li>
                    ))}
                </ul>
            </section>
        </div>

    )
}


export default HowTo;