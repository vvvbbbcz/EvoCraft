import { en, zhHans } from "vuetify/locale";
import en_us from "./i18n/en_us";
import zh_cn from "./i18n/zh_cn";

export default {
    en: {
        $vuetify: {
            ...en
        },
        ...en_us
    },
    zhHans: {
        $vuetify: {
            ...zhHans
        },
        ...zh_cn
    }
}
