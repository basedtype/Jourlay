import { toolsOptions } from "../../../types";

/* CLASSES */
export class tools {
    public static convertTime(time: toolsOptions.time): number {
        let totalTime = 0;
        if (time.seconds != null) totalTime += time.seconds * 1000;
        if (time.minutes != null) totalTime += time.minutes * 60 * 1000;
        if (time.hours != null) totalTime += time.hours * 60 * 60 * 1000;
        if (time.days != null) totalTime += time.days * 24 * 60 * 60 * 1000;
        if (time.weeks != null) totalTime += time.weeks * 7 * 24 * 60 * 60 * 1000;
        if (time.mounths != null) totalTime += time.mounths * 31 * 24 * 60 * 60 * 1000;
        return totalTime;
    }
}