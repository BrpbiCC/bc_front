import { Injectable } from '@angular/core';

export interface Region {
  id: string;
  nombre: string;
  comunas: Comuna[];
}

export interface Comuna {
  id: string;
  nombre: string;
  ciudad?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChileLocationsService {
  private regiones: Region[] = [
    {
      id: '01',
      nombre: 'Arica y Parinacota',
      comunas: [
        { id: '0101', nombre: 'Arica', ciudad: 'Arica' },
        { id: '0102', nombre: 'Camarones', ciudad: 'Arica' },
        { id: '0103', nombre: 'Putre', ciudad: 'Putre' },
        { id: '0104', nombre: 'General Lagos', ciudad: 'Visviri' },
      ],
    },
    {
      id: '02',
      nombre: 'Tarapacá',
      comunas: [
        { id: '0201', nombre: 'Iquique', ciudad: 'Iquique' },
        { id: '0202', nombre: 'Alto Hospicio', ciudad: 'Alto Hospicio' },
        { id: '0203', nombre: 'Pozo Almonte', ciudad: 'Pozo Almonte' },
        { id: '0204', nombre: 'Camiña', ciudad: 'Camiña' },
        { id: '0205', nombre: 'Colchane', ciudad: 'Colchane' },
        { id: '0206', nombre: 'Huara', ciudad: 'Huara' },
        { id: '0207', nombre: 'Pica', ciudad: 'Pica' },
      ],
    },
    {
      id: '03',
      nombre: 'Antofagasta',
      comunas: [
        { id: '0301', nombre: 'Antofagasta', ciudad: 'Antofagasta' },
        { id: '0302', nombre: 'Mejillones', ciudad: 'Mejillones' },
        { id: '0303', nombre: 'Sierra Gorda', ciudad: 'Sierra Gorda' },
        { id: '0304', nombre: 'Taltal', ciudad: 'Taltal' },
        { id: '0305', nombre: 'Calama', ciudad: 'Calama' },
        { id: '0306', nombre: 'Ollagüe', ciudad: 'Ollagüe' },
        { id: '0307', nombre: 'San Pedro de Atacama', ciudad: 'San Pedro de Atacama' },
        { id: '0308', nombre: 'Tocopilla', ciudad: 'Tocopilla' },
        { id: '0309', nombre: 'María Elena', ciudad: 'María Elena' },
      ],
    },
    {
      id: '04',
      nombre: 'Atacama',
      comunas: [
        { id: '0401', nombre: 'Copiapó', ciudad: 'Copiapó' },
        { id: '0402', nombre: 'Caldera', ciudad: 'Caldera' },
        { id: '0403', nombre: 'Tierra Amarilla', ciudad: 'Tierra Amarilla' },
        { id: '0404', nombre: 'Chañaral', ciudad: 'Chañaral' },
        { id: '0405', nombre: 'Diego de Almagro', ciudad: 'Diego de Almagro' },
        { id: '0406', nombre: 'Vallenar', ciudad: 'Vallenar' },
        { id: '0407', nombre: 'Alto del Carmen', ciudad: 'Alto del Carmen' },
        { id: '0408', nombre: 'Freirina', ciudad: 'Freirina' },
        { id: '0409', nombre: 'Huasco', ciudad: 'Huasco' },
      ],
    },
    {
      id: '05',
      nombre: 'Coquimbo',
      comunas: [
        { id: '0501', nombre: 'La Serena', ciudad: 'La Serena' },
        { id: '0502', nombre: 'Coquimbo', ciudad: 'Coquimbo' },
        { id: '0503', nombre: 'Andacollo', ciudad: 'Andacollo' },
        { id: '0504', nombre: 'La Higuera', ciudad: 'La Higuera' },
        { id: '0505', nombre: 'Paihuano', ciudad: 'Paihuano' },
        { id: '0506', nombre: 'Vicuña', ciudad: 'Vicuña' },
        { id: '0507', nombre: 'Illapel', ciudad: 'Illapel' },
        { id: '0508', nombre: 'Canela', ciudad: 'Canela' },
        { id: '0509', nombre: 'Los Vilos', ciudad: 'Los Vilos' },
        { id: '0510', nombre: 'Salamanca', ciudad: 'Salamanca' },
        { id: '0511', nombre: 'Ovalle', ciudad: 'Ovalle' },
        { id: '0512', nombre: 'Combarbalá', ciudad: 'Combarbalá' },
        { id: '0513', nombre: 'Monte Patria', ciudad: 'Monte Patria' },
        { id: '0514', nombre: 'Punitaqui', ciudad: 'Punitaqui' },
        { id: '0515', nombre: 'Río Hurtado', ciudad: 'Río Hurtado' },
      ],
    },
    {
      id: '06',
      nombre: 'Valparaíso',
      comunas: [
        { id: '0601', nombre: 'Valparaíso', ciudad: 'Valparaíso' },
        { id: '0602', nombre: 'Casablanca', ciudad: 'Casablanca' },
        { id: '0603', nombre: 'Concón', ciudad: 'Concón' },
        { id: '0604', nombre: 'Juan Fernández', ciudad: 'Juan Fernández' },
        { id: '0605', nombre: 'Puchuncaví', ciudad: 'Puchuncaví' },
        { id: '0606', nombre: 'Quintero', ciudad: 'Quintero' },
        { id: '0607', nombre: 'Viña del Mar', ciudad: 'Viña del Mar' },
        { id: '0608', nombre: 'Isla de Pascua', ciudad: 'Hanga Roa' },
        { id: '0609', nombre: 'Los Andes', ciudad: 'Los Andes' },
        { id: '0610', nombre: 'Calle Larga', ciudad: 'Calle Larga' },
        { id: '0611', nombre: 'Rinconada', ciudad: 'Rinconada' },
        { id: '0612', nombre: 'San Esteban', ciudad: 'San Esteban' },
        { id: '0613', nombre: 'La Ligua', ciudad: 'La Ligua' },
        { id: '0614', nombre: 'Cabildo', ciudad: 'Cabildo' },
        { id: '0615', nombre: 'Papudo', ciudad: 'Papudo' },
        { id: '0616', nombre: 'Petorca', ciudad: 'Petorca' },
        { id: '0617', nombre: 'Zapallar', ciudad: 'Zapallar' },
        { id: '0618', nombre: 'Quillota', ciudad: 'Quillota' },
        { id: '0619', nombre: 'Calera', ciudad: 'La Calera' },
        { id: '0620', nombre: 'Hijuelas', ciudad: 'Hijuelas' },
        { id: '0621', nombre: 'La Cruz', ciudad: 'La Cruz' },
        { id: '0622', nombre: 'Nogales', ciudad: 'Nogales' },
        { id: '0623', nombre: 'San Antonio', ciudad: 'San Antonio' },
        { id: '0624', nombre: 'Algarrobo', ciudad: 'Algarrobo' },
        { id: '0625', nombre: 'Cartagena', ciudad: 'Cartagena' },
        { id: '0626', nombre: 'El Quisco', ciudad: 'El Quisco' },
        { id: '0627', nombre: 'El Tabo', ciudad: 'El Tabo' },
        { id: '0628', nombre: 'Santo Domingo', ciudad: 'Santo Domingo' },
        { id: '0629', nombre: 'San Felipe', ciudad: 'San Felipe' },
        { id: '0630', nombre: 'Catemu', ciudad: 'Catemu' },
        { id: '0631', nombre: 'Llaillay', ciudad: 'Llaillay' },
        { id: '0632', nombre: 'Panquehue', ciudad: 'Panquehue' },
        { id: '0633', nombre: 'Putaendo', ciudad: 'Putaendo' },
        { id: '0634', nombre: 'Santa María', ciudad: 'Santa María' },
        { id: '0635', nombre: 'Quilpué', ciudad: 'Quilpué' },
        { id: '0636', nombre: 'Limache', ciudad: 'Limache' },
        { id: '0637', nombre: 'Olmué', ciudad: 'Olmué' },
        { id: '0638', nombre: 'Villa Alemana', ciudad: 'Villa Alemana' },
      ],
    },
    {
      id: '07',
      nombre: 'Metropolitana de Santiago',
      comunas: [
        { id: '0701', nombre: 'Cerrillos', ciudad: 'Santiago' },
        { id: '0702', nombre: 'Cerro Navia', ciudad: 'Santiago' },
        { id: '0703', nombre: 'Conchalí', ciudad: 'Santiago' },
        { id: '0704', nombre: 'El Bosque', ciudad: 'Santiago' },
        { id: '0705', nombre: 'Estación Central', ciudad: 'Santiago' },
        { id: '0706', nombre: 'Huechuraba', ciudad: 'Santiago' },
        { id: '0707', nombre: 'Independencia', ciudad: 'Santiago' },
        { id: '0708', nombre: 'La Cisterna', ciudad: 'Santiago' },
        { id: '0709', nombre: 'La Florida', ciudad: 'Santiago' },
        { id: '0710', nombre: 'La Granja', ciudad: 'Santiago' },
        { id: '0711', nombre: 'La Pintana', ciudad: 'Santiago' },
        { id: '0712', nombre: 'La Reina', ciudad: 'Santiago' },
        { id: '0713', nombre: 'Las Condes', ciudad: 'Santiago' },
        { id: '0714', nombre: 'Lo Barnechea', ciudad: 'Santiago' },
        { id: '0715', nombre: 'Lo Espejo', ciudad: 'Santiago' },
        { id: '0716', nombre: 'Lo Prado', ciudad: 'Santiago' },
        { id: '0717', nombre: 'Macul', ciudad: 'Santiago' },
        { id: '0718', nombre: 'Maipú', ciudad: 'Santiago' },
        { id: '0719', nombre: 'Ñuñoa', ciudad: 'Santiago' },
        { id: '0720', nombre: 'Pedro Aguirre Cerda', ciudad: 'Santiago' },
        { id: '0721', nombre: 'Peñalolén', ciudad: 'Santiago' },
        { id: '0722', nombre: 'Providencia', ciudad: 'Santiago' },
        { id: '0723', nombre: 'Pudahuel', ciudad: 'Santiago' },
        { id: '0724', nombre: 'Quilicura', ciudad: 'Santiago' },
        { id: '0725', nombre: 'Quinta Normal', ciudad: 'Santiago' },
        { id: '0726', nombre: 'Recoleta', ciudad: 'Santiago' },
        { id: '0727', nombre: 'Renca', ciudad: 'Santiago' },
        { id: '0728', nombre: 'San Joaquín', ciudad: 'Santiago' },
        { id: '0729', nombre: 'San Miguel', ciudad: 'Santiago' },
        { id: '0730', nombre: 'San Ramón', ciudad: 'Santiago' },
        { id: '0731', nombre: 'Santiago', ciudad: 'Santiago' },
        { id: '0732', nombre: 'Vitacura', ciudad: 'Santiago' },
        { id: '0733', nombre: 'Puente Alto', ciudad: 'Puente Alto' },
        { id: '0734', nombre: 'Pirque', ciudad: 'Pirque' },
        { id: '0735', nombre: 'San José de Maipo', ciudad: 'San José de Maipo' },
        { id: '0736', nombre: 'Colina', ciudad: 'Colina' },
        { id: '0737', nombre: 'Lampa', ciudad: 'Lampa' },
        { id: '0738', nombre: 'Tiltil', ciudad: 'Tiltil' },
        { id: '0739', nombre: 'San Bernardo', ciudad: 'San Bernardo' },
        { id: '0740', nombre: 'Buin', ciudad: 'Buin' },
        { id: '0741', nombre: 'Calera de Tango', ciudad: 'Calera de Tango' },
        { id: '0742', nombre: 'Paine', ciudad: 'Paine' },
        { id: '0743', nombre: 'Melipilla', ciudad: 'Melipilla' },
        { id: '0744', nombre: 'Alhué', ciudad: 'Alhué' },
        { id: '0745', nombre: 'Curacaví', ciudad: 'Curacaví' },
        { id: '0746', nombre: 'María Pinto', ciudad: 'María Pinto' },
        { id: '0747', nombre: 'San Pedro', ciudad: 'San Pedro' },
        { id: '0748', nombre: 'Talagante', ciudad: 'Talagante' },
        { id: '0749', nombre: 'El Monte', ciudad: 'El Monte' },
        { id: '0750', nombre: 'Isla de Maipo', ciudad: 'Isla de Maipo' },
        { id: '0751', nombre: 'Padre Hurtado', ciudad: 'Padre Hurtado' },
        { id: '0752', nombre: 'Peñaflor', ciudad: 'Peñaflor' },
      ],
    },
    {
      id: '08',
      nombre: 'Libertador General Bernardo O\'Higgins',
      comunas: [
        { id: '0801', nombre: 'Rancagua', ciudad: 'Rancagua' },
        { id: '0802', nombre: 'Codegua', ciudad: 'Codegua' },
        { id: '0803', nombre: 'Coinco', ciudad: 'Coinco' },
        { id: '0804', nombre: 'Coltauco', ciudad: 'Coltauco' },
        { id: '0805', nombre: 'Doñihue', ciudad: 'Doñihue' },
        { id: '0806', nombre: 'Graneros', ciudad: 'Graneros' },
        { id: '0807', nombre: 'Las Cabras', ciudad: 'Las Cabras' },
        { id: '0808', nombre: 'Machalí', ciudad: 'Machalí' },
        { id: '0809', nombre: 'Malloa', ciudad: 'Malloa' },
        { id: '0810', nombre: 'Mostazal', ciudad: 'Mostazal' },
        { id: '0811', nombre: 'Olivar', ciudad: 'Olivar' },
        { id: '0812', nombre: 'Peumo', ciudad: 'Peumo' },
        { id: '0813', nombre: 'Pichidegua', ciudad: 'Pichidegua' },
        { id: '0814', nombre: 'Quinta de Tilcoco', ciudad: 'Quinta de Tilcoco' },
        { id: '0815', nombre: 'Rengo', ciudad: 'Rengo' },
        { id: '0816', nombre: 'Requínoa', ciudad: 'Requínoa' },
        { id: '0817', nombre: 'San Vicente', ciudad: 'San Vicente' },
        { id: '0818', nombre: 'Pichilemu', ciudad: 'Pichilemu' },
        { id: '0819', nombre: 'La Estrella', ciudad: 'La Estrella' },
        { id: '0820', nombre: 'Litueche', ciudad: 'Litueche' },
        { id: '0821', nombre: 'Marchihue', ciudad: 'Marchihue' },
        { id: '0822', nombre: 'Navidad', ciudad: 'Navidad' },
        { id: '0823', nombre: 'Paredones', ciudad: 'Paredones' },
        { id: '0824', nombre: 'San Fernando', ciudad: 'San Fernando' },
        { id: '0825', nombre: 'Chépica', ciudad: 'Chépica' },
        { id: '0826', nombre: 'Chimbarongo', ciudad: 'Chimbarongo' },
        { id: '0827', nombre: 'Lolol', ciudad: 'Lolol' },
        { id: '0828', nombre: 'Nancagua', ciudad: 'Nancagua' },
        { id: '0829', nombre: 'Palmilla', ciudad: 'Palmilla' },
        { id: '0830', nombre: 'Peralillo', ciudad: 'Peralillo' },
        { id: '0831', nombre: 'Placilla', ciudad: 'Placilla' },
        { id: '0832', nombre: 'Pumanque', ciudad: 'Pumanque' },
        { id: '0833', nombre: 'Santa Cruz', ciudad: 'Santa Cruz' },
      ],
    },
    {
      id: '09',
      nombre: 'Maule',
      comunas: [
        { id: '0901', nombre: 'Talca', ciudad: 'Talca' },
        { id: '0902', nombre: 'Constitución', ciudad: 'Constitución' },
        { id: '0903', nombre: 'Curepto', ciudad: 'Curepto' },
        { id: '0904', nombre: 'Empedrado', ciudad: 'Empedrado' },
        { id: '0905', nombre: 'Maule', ciudad: 'Maule' },
        { id: '0906', nombre: 'Pelarco', ciudad: 'Pelarco' },
        { id: '0907', nombre: 'Pencahue', ciudad: 'Pencahue' },
        { id: '0908', nombre: 'Río Claro', ciudad: 'Río Claro' },
        { id: '0909', nombre: 'San Clemente', ciudad: 'San Clemente' },
        { id: '0910', nombre: 'San Rafael', ciudad: 'San Rafael' },
        { id: '0911', nombre: 'Cauquenes', ciudad: 'Cauquenes' },
        { id: '0912', nombre: 'Chanco', ciudad: 'Chanco' },
        { id: '0913', nombre: 'Pelluhue', ciudad: 'Pelluhue' },
        { id: '0914', nombre: 'Curicó', ciudad: 'Curicó' },
        { id: '0915', nombre: 'Hualañé', ciudad: 'Hualañé' },
        { id: '0916', nombre: 'Licantén', ciudad: 'Licantén' },
        { id: '0917', nombre: 'Molina', ciudad: 'Molina' },
        { id: '0918', nombre: 'Rauco', ciudad: 'Rauco' },
        { id: '0919', nombre: 'Romeral', ciudad: 'Romeral' },
        { id: '0920', nombre: 'Sagrada Familia', ciudad: 'Sagrada Familia' },
        { id: '0921', nombre: 'Teno', ciudad: 'Teno' },
        { id: '0922', nombre: 'Vichuquén', ciudad: 'Vichuquén' },
        { id: '0923', nombre: 'Linares', ciudad: 'Linares' },
        { id: '0924', nombre: 'Colbún', ciudad: 'Colbún' },
        { id: '0925', nombre: 'Longaví', ciudad: 'Longaví' },
        { id: '0926', nombre: 'Parral', ciudad: 'Parral' },
        { id: '0927', nombre: 'Retiro', ciudad: 'Retiro' },
        { id: '0928', nombre: 'San Javier', ciudad: 'San Javier' },
        { id: '0929', nombre: 'Villa Alegre', ciudad: 'Villa Alegre' },
        { id: '0930', nombre: 'Yerbas Buenas', ciudad: 'Yerbas Buenas' },
      ],
    },
    {
      id: '10',
      nombre: 'Ñuble',
      comunas: [
        { id: '1001', nombre: 'Chillán', ciudad: 'Chillán' },
        { id: '1002', nombre: 'Bulnes', ciudad: 'Bulnes' },
        { id: '1003', nombre: 'Chillán Viejo', ciudad: 'Chillán' },
        { id: '1004', nombre: 'El Carmen', ciudad: 'El Carmen' },
        { id: '1005', nombre: 'Pemuco', ciudad: 'Pemuco' },
        { id: '1006', nombre: 'Pinto', ciudad: 'Pinto' },
        { id: '1007', nombre: 'Quillón', ciudad: 'Quillón' },
        { id: '1008', nombre: 'San Ignacio', ciudad: 'San Ignacio' },
        { id: '1009', nombre: 'Yungay', ciudad: 'Yungay' },
        { id: '1010', nombre: 'Cobquecura', ciudad: 'Cobquecura' },
        { id: '1011', nombre: 'Coelemu', ciudad: 'Coelemu' },
        { id: '1012', nombre: 'Ninhue', ciudad: 'Ninhue' },
        { id: '1013', nombre: 'Portezuelo', ciudad: 'Portezuelo' },
        { id: '1014', nombre: 'Quirihue', ciudad: 'Quirihue' },
        { id: '1015', nombre: 'Ránquil', ciudad: 'Ránquil' },
        { id: '1016', nombre: 'Treguaco', ciudad: 'Treguaco' },
        { id: '1017', nombre: 'San Carlos', ciudad: 'San Carlos' },
        { id: '1018', nombre: 'Coihueco', ciudad: 'Coihueco' },
        { id: '1019', nombre: 'Ñiquén', ciudad: 'Ñiquén' },
        { id: '1020', nombre: 'San Fabián', ciudad: 'San Fabián' },
        { id: '1021', nombre: 'San Nicolás', ciudad: 'San Nicolás' },
      ],
    },
    {
      id: '11',
      nombre: 'Biobío',
      comunas: [
        { id: '1101', nombre: 'Concepción', ciudad: 'Concepción' },
        { id: '1102', nombre: 'Coronel', ciudad: 'Coronel' },
        { id: '1103', nombre: 'Chiguayante', ciudad: 'Chiguayante' },
        { id: '1104', nombre: 'Florida', ciudad: 'Florida' },
        { id: '1105', nombre: 'Hualqui', ciudad: 'Hualqui' },
        { id: '1106', nombre: 'Lota', ciudad: 'Lota' },
        { id: '1107', nombre: 'Penco', ciudad: 'Penco' },
        { id: '1108', nombre: 'San Pedro de la Paz', ciudad: 'San Pedro de la Paz' },
        { id: '1109', nombre: 'Santa Juana', ciudad: 'Santa Juana' },
        { id: '1110', nombre: 'Talcahuano', ciudad: 'Talcahuano' },
        { id: '1111', nombre: 'Tomé', ciudad: 'Tomé' },
        { id: '1112', nombre: 'Hualpén', ciudad: 'Hualpén' },
        { id: '1113', nombre: 'Lebu', ciudad: 'Lebu' },
        { id: '1114', nombre: 'Arauco', ciudad: 'Arauco' },
        { id: '1115', nombre: 'Cañete', ciudad: 'Cañete' },
        { id: '1116', nombre: 'Contulmo', ciudad: 'Contulmo' },
        { id: '1117', nombre: 'Curanilahue', ciudad: 'Curanilahue' },
        { id: '1118', nombre: 'Los Álamos', ciudad: 'Los Álamos' },
        { id: '1119', nombre: 'Tirúa', ciudad: 'Tirúa' },
        { id: '1120', nombre: 'Los Ángeles', ciudad: 'Los Ángeles' },
        { id: '1121', nombre: 'Antuco', ciudad: 'Antuco' },
        { id: '1122', nombre: 'Cabrero', ciudad: 'Cabrero' },
        { id: '1123', nombre: 'Laja', ciudad: 'Laja' },
        { id: '1124', nombre: 'Mulchén', ciudad: 'Mulchén' },
        { id: '1125', nombre: 'Nacimiento', ciudad: 'Nacimiento' },
        { id: '1126', nombre: 'Negrete', ciudad: 'Negrete' },
        { id: '1127', nombre: 'Quilaco', ciudad: 'Quilaco' },
        { id: '1128', nombre: 'Quilleco', ciudad: 'Quilleco' },
        { id: '1129', nombre: 'San Rosendo', ciudad: 'San Rosendo' },
        { id: '1130', nombre: 'Santa Bárbara', ciudad: 'Santa Bárbara' },
        { id: '1131', nombre: 'Tucapel', ciudad: 'Tucapel' },
        { id: '1132', nombre: 'Yumbel', ciudad: 'Yumbel' },
        { id: '1133', nombre: 'Alto Biobío', ciudad: 'Alto Biobío' },
      ],
    },
    {
      id: '12',
      nombre: 'La Araucanía',
      comunas: [
        { id: '1201', nombre: 'Temuco', ciudad: 'Temuco' },
        { id: '1202', nombre: 'Carahue', ciudad: 'Carahue' },
        { id: '1203', nombre: 'Cholchol', ciudad: 'Cholchol' },
        { id: '1204', nombre: 'Cunco', ciudad: 'Cunco' },
        { id: '1205', nombre: 'Curarrehue', ciudad: 'Curarrehue' },
        { id: '1206', nombre: 'Freire', ciudad: 'Freire' },
        { id: '1207', nombre: 'Galvarino', ciudad: 'Galvarino' },
        { id: '1208', nombre: 'Gorbea', ciudad: 'Gorbea' },
        { id: '1209', nombre: 'Lautaro', ciudad: 'Lautaro' },
        { id: '1210', nombre: 'Loncoche', ciudad: 'Loncoche' },
        { id: '1211', nombre: 'Melipeuco', ciudad: 'Melipeuco' },
        { id: '1212', nombre: 'Nueva Imperial', ciudad: 'Nueva Imperial' },
        { id: '1213', nombre: 'Padre Las Casas', ciudad: 'Padre Las Casas' },
        { id: '1214', nombre: 'Perquenco', ciudad: 'Perquenco' },
        { id: '1215', nombre: 'Pitrufquén', ciudad: 'Pitrufquén' },
        { id: '1216', nombre: 'Pucón', ciudad: 'Pucón' },
        { id: '1217', nombre: 'Saavedra', ciudad: 'Saavedra' },
        { id: '1218', nombre: 'Teodoro Schmidt', ciudad: 'Teodoro Schmidt' },
        { id: '1219', nombre: 'Toltén', ciudad: 'Toltén' },
        { id: '1220', nombre: 'Vilcún', ciudad: 'Vilcún' },
        { id: '1221', nombre: 'Villarrica', ciudad: 'Villarrica' },
        { id: '1222', nombre: 'Angol', ciudad: 'Angol' },
        { id: '1223', nombre: 'Collipulli', ciudad: 'Collipulli' },
        { id: '1224', nombre: 'Curacautín', ciudad: 'Curacautín' },
        { id: '1225', nombre: 'Ercilla', ciudad: 'Ercilla' },
        { id: '1226', nombre: 'Lonquimay', ciudad: 'Lonquimay' },
        { id: '1227', nombre: 'Los Sauces', ciudad: 'Los Sauces' },
        { id: '1228', nombre: 'Lumaco', ciudad: 'Lumaco' },
        { id: '1229', nombre: 'Purén', ciudad: 'Purén' },
        { id: '1230', nombre: 'Renaico', ciudad: 'Renaico' },
        { id: '1231', nombre: 'Traiguén', ciudad: 'Traiguén' },
        { id: '1232', nombre: 'Victoria', ciudad: 'Victoria' },
      ],
    },
    {
      id: '14',
      nombre: 'Los Ríos',
      comunas: [
        { id: '1401', nombre: 'Valdivia', ciudad: 'Valdivia' },
        { id: '1402', nombre: 'Corral', ciudad: 'Corral' },
        { id: '1403', nombre: 'Lanco', ciudad: 'Lanco' },
        { id: '1404', nombre: 'Los Lagos', ciudad: 'Los Lagos' },
        { id: '1405', nombre: 'Máfil', ciudad: 'Máfil' },
        { id: '1406', nombre: 'Mariquina', ciudad: 'Mariquina' },
        { id: '1407', nombre: 'Paillaco', ciudad: 'Paillaco' },
        { id: '1408', nombre: 'Panguipulli', ciudad: 'Panguipulli' },
        { id: '1409', nombre: 'La Unión', ciudad: 'La Unión' },
        { id: '1410', nombre: 'Futrono', ciudad: 'Futrono' },
        { id: '1411', nombre: 'Lago Ranco', ciudad: 'Lago Ranco' },
        { id: '1412', nombre: 'Río Bueno', ciudad: 'Río Bueno' },
      ],
    },
    {
      id: '15',
      nombre: 'Los Lagos',
      comunas: [
        { id: '1501', nombre: 'Puerto Montt', ciudad: 'Puerto Montt' },
        { id: '1502', nombre: 'Calbuco', ciudad: 'Calbuco' },
        { id: '1503', nombre: 'Cochamó', ciudad: 'Cochamó' },
        { id: '1504', nombre: 'Fresia', ciudad: 'Fresia' },
        { id: '1505', nombre: 'Frutillar', ciudad: 'Frutillar' },
        { id: '1506', nombre: 'Los Muermos', ciudad: 'Los Muermos' },
        { id: '1507', nombre: 'Llanquihue', ciudad: 'Llanquihue' },
        { id: '1508', nombre: 'Maullín', ciudad: 'Maullín' },
        { id: '1509', nombre: 'Puerto Varas', ciudad: 'Puerto Varas' },
        { id: '1510', nombre: 'Castro', ciudad: 'Castro' },
        { id: '1511', nombre: 'Ancud', ciudad: 'Ancud' },
        { id: '1512', nombre: 'Chonchi', ciudad: 'Chonchi' },
        { id: '1513', nombre: 'Curaco de Vélez', ciudad: 'Curaco de Vélez' },
        { id: '1514', nombre: 'Dalcahue', ciudad: 'Dalcahue' },
        { id: '1515', nombre: 'Puqueldón', ciudad: 'Puqueldón' },
        { id: '1516', nombre: 'Queilén', ciudad: 'Queilén' },
        { id: '1517', nombre: 'Quellón', ciudad: 'Quellón' },
        { id: '1518', nombre: 'Quemchi', ciudad: 'Quemchi' },
        { id: '1519', nombre: 'Quinchao', ciudad: 'Quinchao' },
        { id: '1520', nombre: 'Osorno', ciudad: 'Osorno' },
        { id: '1521', nombre: 'Puerto Octay', ciudad: 'Puerto Octay' },
        { id: '1522', nombre: 'Purranque', ciudad: 'Purranque' },
        { id: '1523', nombre: 'Puyehue', ciudad: 'Puyehue' },
        { id: '1524', nombre: 'Río Negro', ciudad: 'Río Negro' },
        { id: '1525', nombre: 'San Juan de la Costa', ciudad: 'San Juan de la Costa' },
        { id: '1526', nombre: 'San Pablo', ciudad: 'San Pablo' },
        { id: '1527', nombre: 'Chaitén', ciudad: 'Chaitén' },
        { id: '1528', nombre: 'Futaleufú', ciudad: 'Futaleufú' },
        { id: '1529', nombre: 'Hualaihué', ciudad: 'Hualaihué' },
        { id: '1530', nombre: 'Palena', ciudad: 'Palena' },
      ],
    },
    {
      id: '16',
      nombre: 'Aysén del General Carlos Ibáñez del Campo',
      comunas: [
        { id: '1601', nombre: 'Coyhaique', ciudad: 'Coyhaique' },
        { id: '1602', nombre: 'Lago Verde', ciudad: 'Lago Verde' },
        { id: '1603', nombre: 'Aysén', ciudad: 'Aysén' },
        { id: '1604', nombre: 'Cisnes', ciudad: 'Cisnes' },
        { id: '1605', nombre: 'Guaitecas', ciudad: 'Guaitecas' },
        { id: '1606', nombre: 'Cochrane', ciudad: 'Cochrane' },
        { id: '1607', nombre: 'O\'Higgins', ciudad: 'O\'Higgins' },
        { id: '1608', nombre: 'Tortel', ciudad: 'Tortel' },
        { id: '1609', nombre: 'Chile Chico', ciudad: 'Chile Chico' },
        { id: '1610', nombre: 'Río Ibáñez', ciudad: 'Río Ibáñez' },
      ],
    },
    {
      id: '17',
      nombre: 'Magallanes y de la Antártica Chilena',
      comunas: [
        { id: '1701', nombre: 'Punta Arenas', ciudad: 'Punta Arenas' },
        { id: '1702', nombre: 'Laguna Blanca', ciudad: 'Laguna Blanca' },
        { id: '1703', nombre: 'Río Verde', ciudad: 'Río Verde' },
        { id: '1704', nombre: 'San Gregorio', ciudad: 'San Gregorio' },
        { id: '1705', nombre: 'Cabo de Hornos', ciudad: 'Puerto Williams' },
        { id: '1706', nombre: 'Antártica', ciudad: 'Puerto Williams' },
        { id: '1707', nombre: 'Porvenir', ciudad: 'Porvenir' },
        { id: '1708', nombre: 'Primavera', ciudad: 'Primavera' },
        { id: '1709', nombre: 'Timaukel', ciudad: 'Timaukel' },
        { id: '1710', nombre: 'Natales', ciudad: 'Puerto Natales' },
        { id: '1711', nombre: 'Torres del Paine', ciudad: 'Torres del Paine' },
      ],
    },
  ];

  constructor() {}

  getRegiones(): Region[] {
    return this.regiones;
  }

  getRegionesSelect(): Array<{ value: string; label: string }> {
    return this.regiones.map((r) => ({
      value: r.id,
      label: r.nombre,
    }));
  }

  getComunasByRegion(regionId: string): Comuna[] {
    const region = this.regiones.find((r) => r.id === regionId);
    return region ? region.comunas : [];
  }

  getComunasSelect(regionId?: string): Array<{ value: string; label: string }> {
    if (!regionId) {
      return this.regiones.flatMap((r) =>
        r.comunas.map((c) => ({
          value: c.id,
          label: `${c.nombre} (${r.nombre})`,
        }))
      );
    }
    const region = this.regiones.find((r) => r.id === regionId);
    return region
      ? region.comunas.map((c) => ({
          value: c.id,
          label: c.nombre,
        }))
      : [];
  }

  getCiudadesByRegion(regionId: string): string[] {
    const region = this.regiones.find((r) => r.id === regionId);
    if (!region) return [];
    const ciudadesSet = new Set(region.comunas.map((c) => c.ciudad || c.nombre));
    return Array.from(ciudadesSet).sort();
  }

  getCiudadesSelect(regionId?: string): Array<{ value: string; label: string }> {
    if (!regionId) {
      const ciudadesSet = new Set<string>();
      this.regiones.forEach((r) =>
        r.comunas.forEach((c) => ciudadesSet.add(c.ciudad || c.nombre))
      );
      return Array.from(ciudadesSet)
        .sort()
        .map((ciudad) => ({
          value: ciudad,
          label: ciudad,
        }));
    }
    return this.getCiudadesByRegion(regionId).map((ciudad) => ({
      value: ciudad,
      label: ciudad,
    }));
  }

  getComunaById(comunaId: string): Comuna | undefined {
    for (const region of this.regiones) {
      const comuna = region.comunas.find((c) => c.id === comunaId);
      if (comuna) return comuna;
    }
    return undefined;
  }
}
