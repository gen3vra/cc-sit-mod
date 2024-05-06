if (versions.hasOwnProperty('input-api')) {
    sc.OPTIONS_DEFINITION['keys-sitanywhere'] = {
        type: 'CONTROLS',
        init: {key1: 220},
        cat: sc.OPTION_CATEGORY.CONTROLS,
        hasDivider: true,
        header: 'sitanywhere',
    };
    sc.OPTIONS_DEFINITION['keys-sitanywhereL'] = {
        type: 'CONTROLS',
        init: {key1: 219},
        cat: sc.OPTION_CATEGORY.CONTROLS,
        header: 'sitanywhereL',
    };
    sc.OPTIONS_DEFINITION['keys-sitanywhereR'] = {
        type: 'CONTROLS',
        init: {key1: 221},
        cat: sc.OPTION_CATEGORY.CONTROLS,
        header: 'sitanywhereR',
    };

}