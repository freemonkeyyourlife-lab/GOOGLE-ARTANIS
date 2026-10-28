import { KinkCategory } from '../types';

export const KINKS_DATABASE: KinkCategory[] = [
  {
    category: 'CNC & Beziehungsdynamik',
    description: 'Einvernehmliche Rollenspiele mit Kontrollübernahme, Dominanz und Hingabe',
    items: [
      {
        id: 'cnc',
        label: 'CNC (Consensual Non-Consent)',
        tags: ['consensual_non_consent', 'reluctant_expression', 'submissive_pose', 'intense_eye_contact'],
        description: 'Verhandelte Grenzüberschreitung und intensive Rollenspiel-Dynamik im Chat',
        intensity: 'hard',
      },
      {
        id: 'dom_sub',
        label: 'Dominanz & Unterwerfung',
        tags: ['dominant_submissive', 'kneeling', 'commanding_gaze', 'collar'],
        description: 'Klare Hierarchien im Rollenspiel mit Befehlen und Gehorsam',
        intensity: 'medium',
      },
      {
        id: 'bondage',
        label: 'Fesselung & Bondage (Shibari)',
        tags: ['rope_bondage', 'tied_wrists', 'shibari', 'helpless_pose'],
        description: 'Ästhetische Seilfesseln oder weiche Bettfesseln',
        intensity: 'hard',
      },
      {
        id: 'praise_degradation',
        label: 'Praise & dirty talk',
        tags: ['whispering', 'dirty_talk', 'blushing', 'aroused_expression'],
        description: 'Verbale Bestätigung oder erotisches Vokabular im Chatverlauf',
        intensity: 'soft',
      },
    ],
  },
  {
    category: 'Posen & Stellungen',
    description: 'Spezifische Bildwinkel und anatomische Posen für perfekte Bildgenerierung',
    items: [
      {
        id: 'doggy',
        label: 'Von hinten (Doggy Style / All Fours)',
        tags: ['from_behind', 'on_all_fours', 'arched_back', 'looking_back_at_viewer'],
        description: 'Gebogener Rücken, Blick über die Schulter zur Kamera',
        intensity: 'medium',
      },
      {
        id: 'cowgirl',
        label: 'Reitend (Cowgirl / Straddling)',
        tags: ['straddling', 'riding_pose', 'hands_on_chest', 'direct_gaze', 'sweaty_skin'],
        description: 'Sitzend auf dem Partner, dynamische Bewegung',
        intensity: 'medium',
      },
      {
        id: 'pov',
        label: 'POV (Egoperspektive)',
        tags: ['pov', 'first_person_view', 'hands_holding_hips', 'eye_level_shot'],
        description: 'Kamera direkt aus deiner Sicht für maximale Immersion',
        intensity: 'medium',
      },
      {
        id: 'missionary',
        label: 'Nahaufnahme / Liegend',
        tags: ['lying_on_back', 'legs_spread', 'close_up_face', 'ecstatic_expression'],
        description: 'Intime Nahaufnahme mit Fokus auf Mimik und Blickkontakt',
        intensity: 'soft',
      },
    ],
  },
  {
    category: 'Outfits & Enthüllung',
    description: 'Kleidungsstile von Strandmode bis zur schrittweisen Enthüllung',
    items: [
      {
        id: 'micro_bikini',
        label: 'Micro-Bikini (Lila Signature)',
        tags: ['micro_bikini', 'string_bikini', 'bare_shoulders', 'tan_lines'],
        description: 'Extrem knapp geschnittener Bikini, ideal für Strand-Szenen',
        intensity: 'soft',
      },
      {
        id: 'wetlook',
        label: 'Wetlook & Nasse Kleidung',
        tags: ['wet_clothes', 'wet_skin', 'translucent_fabric', 'water_droplets'],
        description: 'Nasses durchsichtiges Gewebe, Meerwasser oder Dusche',
        intensity: 'medium',
      },
      {
        id: 'lingerie',
        label: 'Spitzen-Dessous & Strapse',
        tags: ['black_lace_lingerie', 'stockings', 'garter_belt', 'satin_sheets'],
        description: 'Edle schwarze oder rote Spitze für Schlafzimmer-Settings',
        intensity: 'soft',
      },
      {
        id: 'disrobing',
        label: 'Ausziehen (Action Strip)',
        tags: ['pulling_down_bikini', 'disrobing', 'half_undressed', 'exposed_breasts'],
        description: 'Der Moment des Herunterziehens oder Öffnens der Kleidung',
        intensity: 'medium',
      },
      {
        id: 'nude',
        label: 'Vollständig Nackt (Explicit Nude)',
        tags: ['explicit_nudity', 'full_body_nude', 'detailed_anatomy', 'uncensored'],
        description: 'Unzensierte anatomische Darstellung ohne Kleidungsstücke',
        intensity: 'hard',
      },
    ],
  },
  {
    category: 'Kulissen & Licht',
    description: 'Atmosphärische Umgebungen für Foto- und Video-Shootings',
    items: [
      {
        id: 'beach_sunset',
        label: 'Tropischer Strand & Sonnenuntergang',
        tags: ['tropical_beach', 'golden_hour', 'ocean_waves', 'warm_sunlight', 'wet_sand'],
        description: 'Goldene Abendsonne, sanfte Wellen, warmer Hautglanz',
        intensity: 'soft',
      },
      {
        id: 'luxury_bedroom',
        label: 'Modernes Penthouse-Schlafzimmer',
        tags: ['luxury_penthouse_bedroom', 'city_skyline_night', 'dim_ambient_lighting', 'silk_sheets'],
        description: 'Dunkle, exklusive Atmosphäre mit Blick auf Stadtlichter',
        intensity: 'soft',
      },
      {
        id: 'studio_lights',
        label: 'Professionelles Foto-Studio',
        tags: ['photo_studio', 'rim_lighting', 'softbox_glow', 'depth_of_field', 'high_key_contrast'],
        description: 'Scharfer Fokus auf Hauttexturen und Konturen',
        intensity: 'soft',
      },
      {
        id: 'shower_spa',
        label: 'Dampfdusche & Marmor-Spa',
        tags: ['steamy_glass_shower', 'water_streaming', 'fogged_mirror', 'dripping_wet'],
        description: 'Heißer Wasserdampf und Tropfen auf der Haut',
        intensity: 'medium',
      },
    ],
  },
];
