import {
    codeFixAll,
    createCodeFixAction,
    registerCodeFix,
} from "../_namespaces/ts.codefix.js";
import {
    addToSeen,
    Diagnostics,
    factory,
    findAncestor,
    getNodeId,
    getTokenAtPosition,
    isStatement,
    SourceFile,
    Statement,
    textChanges,
} from "../_namespaces/ts.js";

const fixName = "wrapUnhandledInTryCatch";
const fixId = "wrapUnhandledInTryCatch";
const errorCodes = [
    Diagnostics.Unhandled_thrown_type_Colon_0.code,
    Diagnostics.Unhandled_promise_rejection_type_Colon_0.code,
];

registerCodeFix({
    errorCodes,
    fixIds: [fixId],
    getCodeActions(context) {
        const { sourceFile, span } = context;
        const statement = getStatementAtPosition(sourceFile, span.start);
        if (!statement) return undefined;
        const changes = textChanges.ChangeTracker.with(context, t => wrapInTryCatch(t, sourceFile, statement));
        return [
            createCodeFixAction(
                fixName,
                changes,
                Diagnostics.Wrap_in_try_Slashcatch,
                fixId,
                Diagnostics.Wrap_all_unhandled_in_try_Slashcatch,
            ),
        ];
    },
    getAllCodeActions(context) {
        const seen = new Set<number>();
        return codeFixAll(context, errorCodes, (changes, diag) => {
            const statement = getStatementAtPosition(diag.file, diag.start);
            if (!statement || !addToSeen(seen, getNodeId(statement))) return;
            wrapInTryCatch(changes, context.sourceFile, statement);
        });
    },
});

function getStatementAtPosition(
    sourceFile: SourceFile,
    start: number,
): Statement | undefined {
    const token = getTokenAtPosition(sourceFile, start);
    const node = findAncestor(token, isStatement);
    return node && isStatement(node) ? node : undefined;
}

function wrapInTryCatch(
    changes: textChanges.ChangeTracker,
    sourceFile: SourceFile,
    statement: Statement,
): void {
    const tryBlock = factory.createBlock([statement]);
    const catchClause = factory.createCatchClause(
        "e",
        factory.createBlock([]),
    );
    const tryStatement = factory.createTryStatement(
        tryBlock,
        catchClause,
        /*finallyBlock*/ undefined,
    );
    changes.replaceNode(sourceFile, statement, tryStatement);
}
