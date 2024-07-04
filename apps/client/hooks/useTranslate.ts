import { LANGUAGES_MAPPING, LANGUAGES_TYPE } from "const/languages";
import { useRouter } from "next/router";

const useTrans = () => {
  const { locale } = useRouter();

  const trans = locale
    ? LANGUAGES_MAPPING[locale as LANGUAGES_TYPE]
    : LANGUAGES_MAPPING[Object.keys(LANGUAGES_MAPPING)[0] as LANGUAGES_TYPE];

  return trans;
};

export default useTrans;
