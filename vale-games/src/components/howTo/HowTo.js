import React from "react";
import styles from "./howTo.module.css";
import { PiArrowFatRight } from "react-icons/pi";

function HowTo ({summary, controls}) {
    return (
        <div className={styles.component}>
            <section className={styles.summary}>
                <h2>Summary</h2>
                <p>{summary}</p>
            </section>

            <section className={styles.summary}>
                <h2>Controls</h2>
                <ul className={styles.controls}>
                    {controls.map((control, index) => (
                        <li className={styles.control} key={index}>
                            <span>{control.icon}</span>
                            <span> <PiArrowFatRight /></span>
                            <span>{control.description}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>

    )
}


export default HowTo;