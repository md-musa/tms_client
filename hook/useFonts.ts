import { useFonts } from "expo-font";
import sfRegular from "../assets/fonts/SFPRODISPLAYREGULAR.OTF";
import sfMedium from "../assets/fonts/SFPRODISPLAYMEDIUM.OTF";
import sfBold from "../assets/fonts/SFPRODISPLAYBOLD.OTF";
import sfBlackItalic from "../assets/fonts/SFPRODISPLAYBLACKITALIC.OTF";
import sfHeavyItalic from "../assets/fonts/SFPRODISPLAYHEAVYITALIC.OTF";
import sfLightItalic from "../assets/fonts/SFPRODISPLAYLIGHTITALIC.OTF";
import sfSemiBoldItalic from "../assets/fonts/SFPRODISPLAYSEMIBOLDITALIC.OTF";
import sfThinItalic from "../assets/fonts/SFPRODISPLAYTHINITALIC.OTF";
import sfUltraLightItalic from "../assets/fonts/SFPRODISPLAYULTRALIGHTITALIC.OTF";

export function useCustomFonts() {
    const [fontsLoaded] = useFonts({
        sf_regular: sfRegular,
        sf_medium: sfMedium,
        sf_bold: sfBold,
        sf_black_italic: sfBlackItalic,
        sf_heavy_italic: sfHeavyItalic,
        sf_light_italic: sfLightItalic,
        sf_semi_bold_italic: sfSemiBoldItalic,
        sf_thin_italic: sfThinItalic,
        sf_ultra_light_italic: sfUltraLightItalic,
    });

    return fontsLoaded;
}
