export type TRootStackParamList = {
  GreetingForm: undefined;
  GreetingResult: { greeting: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}