import { setup, assign } from "xstate";

export const machine = setup({
  types: {
    context: {} as { applicationContent?: string },
    events: {} as
      | { type: "submit"; content: string }
      | { type: "approve" }
      | { type: "cancel" }
      | { type: "reject" }
      | { type: "resubmit"; content: string },
  },
  actions: {
    submitAction: assign({
      applicationContent: ({ event }) =>
        event.type === "submit" ? event.content : "",
    }),
    resubmitAction: assign({
      applicationContent: ({ event }) =>
        event.type === "resubmit" ? event.content : "",
    }),
  },
}).createMachine({
  context: {},
  id: "approve-flow",
  initial: "draft",
  states: {
    draft: {
      on: {
        submit: {
          target: "pending",
          actions: {
            type: "submitAction",
          },
        },
        cancel: {
          target: "canceled",
        },
      },
    },
    pending: {
      on: {
        approve: {
          target: "approved",
        },
        reject: {
          target: "rejected",
        },
        cancel: {
          target: "canceled",
        },
      },
    },
    canceled: {},
    approved: {
      on: {
        cancel: {
          target: "canceled",
        },
      },
    },
    rejected: {
      on: {
        resubmit: {
          target: "pending",
          actions: {
            type: "resubmitAction",
          },
        },
        cancel: {
          target: "canceled",
        },
      },
    },
  },
});
