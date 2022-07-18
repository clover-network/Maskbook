import { createIcon } from '../utils'
import type { SvgIcon } from '@mui/material'

export const SuccessForSnackBarIcon: typeof SvgIcon = createIcon(
    'SuccessForSnackBar',
    <g>
        <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.7202 8.64056C17.0717 8.99203 17.0717 9.56188 16.7202 9.91335L11.2741 15.3595C10.9226 15.7109 10.3528 15.7109 10.0013 15.3595L7.27825 12.6364C6.92678 12.2849 6.92678 11.7151 7.27825 11.3636C7.62972 11.0121 8.19957 11.0121 8.55104 11.3636L10.6377 13.4503L15.4474 8.64056C15.7989 8.28909 16.3688 8.28909 16.7202 8.64056Z"
            fill="#3DC233"
        />
    </g>,
    '0 0 24 24',
)