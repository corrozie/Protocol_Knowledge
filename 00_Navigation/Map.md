# Карта связей

[Главная](../README.md) · [Графическая карта для Obsidian](../Knowledge_Map.canvas)

Ниже стрелка означает конкретную подписанную связь, а не обязательный порядок применения всех технологий.

## Доступ и адресация

- [Ethernet](../02_Access/Ethernet.md) или [Wi-Fi](../02_Access/WiFi.md) → **создаёт локальный канал** → [IP](../01_Foundations/IP.md).
- [DHCP](../01_Foundations/DHCP.md) → **выдаёт IPv4-параметры и адрес резолвера** → IP и [DNS](../01_Foundations/DNS.md).
- [IPv6](../01_Foundations/IPv6.md) → **может использовать SLAAC и Neighbor Discovery** → настройка без DHCPv4.
- [BGP](../01_Foundations/BGP.md) → **распространяет междоменные маршруты** → пересылка IP.
- [ICMP](../01_Foundations/ICMP.md) → **сообщает о достижимости и ошибках** → диагностика IP.
- [PPPoE](../02_Access/PPPoE.md) → **создаёт абонентскую сессию поверх Ethernet** → подключение к провайдеру.

## Приложения и транспорт

- [HTTP](../04_Web/HTTP.md), [SMTP](../05_Applications/SMTP.md), [IMAP](../05_Applications/IMAP.md), [POP3](../05_Applications/POP3.md), [FTP](../05_Applications/FTP.md), [SMB](../05_Applications/SMB.md), [Modbus/TCP](../05_Applications/Modbus.md) → **используют надёжный поток в разобранных сценариях** → [TCP](../03_Transport/TCP.md).
- [WebRTC](../05_Applications/WebRTC.md) и [NTP](../01_Foundations/NTP.md) → **обычно используют датаграммы** → [UDP](../03_Transport/UDP.md).
- DNS → **обычно начинает запрос через UDP/53, также использует TCP/53** → оба транспорта.
- [WebSocket](../04_Web/WebSocket.md) → **поддерживает двусторонний прикладной канал** → TCP, при wss также TLS.
- [SIP](../05_Applications/SIP.md) и [RTSP](../05_Applications/RTSP.md) → **управляют медиасеансом** → RTP переносит медиа отдельно.
- [IGMP](../05_Applications/IGMP.md) → **объявляет интерес к multicast-группе** → доставка общего потока нескольким получателям.
- [RTMP](../05_Applications/RTMP.md) → **загружает трансляцию** → сервер приёма платформы.

## Разные границы защиты

- [TLS](../06_Security/TLS.md) → **защищает HTTP** → [HTTPS](../04_Web/HTTPS.md).
- HTTPS → **переносит DNS-запрос к резолверу** → [DoH](../06_Security/DoH.md).
- [DNSSEC](../06_Security/DNSSEC.md) → **подтверждает происхождение DNS-данных** → DNS. Это дополняет DoH, который защищает канал.
- [WPA3](../06_Security/WPA3.md) → **защищает радиоканал** → Wi-Fi; [RADIUS](../06_Security/RADIUS.md) → **централизует допуск** → корпоративная сеть.
- [WireGuard](../06_Security/WireGuard.md) и [IPsec](../06_Security/IPsec.md) → **защищают участок между VPN-узлами** → внутренние IP-пакеты.
- [SSH](../06_Security/SSH.md) → **защищает удалённый доступ** → команды, SFTP и туннели.

## Посредники

- [HTTP Proxy](../04_Web/HTTPProxy.md) → **действует от имени клиента** → внешний сервер.
- [SOCKS5](../04_Web/SOCKS5.md) → **создаёт соединение к выбранной цели** → приложение произвольного типа.
- [Reverse Proxy](../04_Web/ReverseProxy.md) → **принимает запросы перед приложением** → backend-сервер.
- [Captive Portal](../02_Access/CaptivePortal.md) → **разрешает интернет после входа** → пользователь публичной сети.

Не следует читать карту как один длинный стек: BGP не нужен внутри HTTP-запроса, а IGMP не передаёт видеокадры. Каждая связь отвечает на вопрос «какую задачу одна технология решает для другой».
