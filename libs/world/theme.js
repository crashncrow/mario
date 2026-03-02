export const WORLD_THEME = {
  overworld: {
    blockDarkBg: 'bg-smb-orange-dark',
    blockLightBg: 'bg-smb-orange-light',
    blockDarkBorder: 'border-smb-orange-dark',
    blockLightBorder: 'border-smb-orange-light',
    floorDarkBg: 'bg-smb-orange-dark',
    floorLightBg: 'bg-smb-orange-light',
    floorDarkBorder: 'border-smb-orange-dark',
    floorLightBorder: 'border-smb-orange-light',
  },
  underground: {
    blockDarkBg: 'bg-smb-cyan-dark',
    blockLightBg: 'bg-smb-cyan-light',
    blockDarkBorder: 'border-smb-cyan-dark',
    blockLightBorder: 'border-smb-cyan-light',
    floorDarkBg: 'bg-smb-cyan-dark',
    floorLightBg: 'bg-smb-cyan-light',
    floorDarkBorder: 'border-smb-cyan-dark',
    floorLightBorder: 'border-smb-cyan-light',
  },
}

export const getWorldTheme = theme => WORLD_THEME[theme] ?? WORLD_THEME.overworld
