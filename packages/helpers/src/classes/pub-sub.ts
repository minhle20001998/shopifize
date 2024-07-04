import { Subcriber } from "..";

export class PubSub<T = unknown> {
  private subscribers: Array<Subcriber<T>>;

  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber: Subcriber<T>) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for subscribe method, expected a function instead`
      );
    }
    this.subscribers = [...this.subscribers, subscriber];
  }

  unsubscribe(subscriber: Subcriber<T>) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for unsubscribe method, expected a function instead`
      );
    }
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  publish(payload: T) {
    this.subscribers.forEach((subscriber) => subscriber(payload));
  }
}
