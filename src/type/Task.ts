enum TaskStatus {
    NEW,
    VIEWED,
    IN_PROGRESS,
    DONE,
    ARCHIVED,
    HOLD,
    BLOCKED
}

enum TaskType {
    MICRO,
    SMALL,
    MEDIUM,
    LONG,
    EXTRA_LONG,
    NOT_CLASSIFIED
}

enum TaskQuadrant {
    URGENT_IMPORTANT,
    NO_URGENT_IMPORTANT,
    URGENT_NO_IMPORTANT,
    NO_URGENT_NO_IMPORTANT,
    NOT_CLASSIFIED
}

interface Task {
    id: number | null,
    name: string,
    description: string,
    taskStatus: TaskStatus,
    taskType: TaskType,
    taskQuadrant: TaskQuadrant,
    project: Project | null
}
